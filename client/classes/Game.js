import * as BABYLON from 'babylonjs';
import Player from './Player';
import Orb from './objects/Orb';
import * as Hydra from 'hydra-synth';
import * as CodeMirror from "codemirror";

export default class Game {
    constructor(canvasId, mesh) {
        // get element from html file.
        const canvas = document.getElementById(canvasId);
        var time = 0;
        var shaderCount = 0;
        this.shaderMaterials = [];
        var mode = "plane";

        this.cm = CodeMirror.fromTextArea(document.getElementById("code"), {
            theme: 'tomorrow-night-eighties',
            mode: {name: 'javascript', globallets: true},
            // lineWrapping: true,
            styleSelectedText: true,
            lineNumbers: true
        });

        // hydra.noise(100, 0.4)
        //   .pixelate(40,40)
        //   .mult(osc(1000, 0.001, 0.8).rotate(Math.PI * 0.5))
        //   .mult(osc(100, () => (time / 0.005) % 0.005, 0.5).color(0.5, 4, 4))
        //   .kaleid(2).glsl()


        var hydraCanvas = document.createElement('canvas');
        hydraCanvas.width = 100;
        hydraCanvas.height = 100;

        // initiate the engine.
        this.engine = new BABYLON.Engine(canvas, true);

        // loads the scene.
        BABYLON.SceneLoader.Load('', `data:${JSON.stringify(mesh.scene)}`, this.engine, scene => {
            this.scene = scene;
            this.scene.activeCamera.attachControl(canvas, true);
            new BABYLON.Layer('background', 'assets/textures/background.jpg', this.scene, true);

            this.orb = new Orb(this.scene, this.shaderMaterials);

            // Gizmos
            this.gizmoManager = new BABYLON.GizmoManager(this.scene);
            this.gizmoManager.positionGizmoEnabled = true;
            this.gizmoManager.rotationGizmoEnabled = true;
            this.gizmoManager.scaleGizmoEnabled = true;
            this.gizmoManager.boundingBoxGizmoEnabled = true;
            this.gizmoManager.attachableMeshes = [this.orb];

        });

        document.getElementById('box').onclick = function () {
            mode = "box";
        };
        document.getElementById('plane').onclick = function () {
            mode = "plane";
        };
        document.getElementById('sphere').onclick = function () {
            console.log("here");
            mode = "sphere";
        };

        this.scene.onPointerDown = (event, pickResult) => {

            // HYDRA
            if (event.shiftKey) {
                const hydra = new Hydra({canvas: hydraCanvas});
                let toEval = this.cm.getValue();
                let output = eval(toEval);
                console.dir(output);

                BABYLON.Effect.ShadersStore["custom" + this.socket.id + shaderCount + "FragmentShader"] = output[0].frag;
                console.log("custom" + this.socket.id + shaderCount + "FragmentShader");
                BABYLON.Effect.ShadersStore["customVertexShader"] = "precision highp float;\r\n" +

                    "// Attributes\r\n" +
                    "attribute vec3 position;\r\n" +
                    "attribute vec3 normal;\r\n" +
                    "attribute vec2 uv;\r\n" +

                    "// Uniforms\r\n" +
                    "uniform mat4 worldViewProjection;\r\n" +

                    "// Varying\r\n" +
                    "varying vec4 vPosition;\r\n" +
                    "varying vec2 vUv;\r\n" +
                    "varying vec3 vNormal;\r\n" +

                    "void main() {\r\n" +

                    "    vec4 p = vec4( position, 1. );\r\n" +

                    "    vPosition = p;\r\n" +
                    "    vNormal = normal;\r\n" +
                    "    vUv = uv;\r\n" +

                    "    gl_Position = worldViewProjection * p;\r\n" +

                    "}\r\n";

                console.log(Object.keys(output[0].uniforms));

                const not_allowed = ['time', 'resolution'];
                const raw = output[0].uniforms;
                const filtered = Object.keys(raw)
                    .filter(key => !not_allowed.includes(key))
                    .reduce((obj, key) => {
                        obj[key] = raw[key];
                        return obj;
                    }, {});

                console.log(filtered);
                var myShaderMaterial = new BABYLON.ShaderMaterial("", this.scene, {
                        vertex: "custom",
                        fragment: "custom" + this.socket.id + shaderCount
                    },
                    {
                        attributes: ["position", "normal", "uv"],
                        uniforms: ["time", "resolution", "world", "worldView", "worldViewProjection", "view", "projection"]
                    });
                myShaderMaterial.setVector2('resolution', new BABYLON.Vector2(canvas.width, canvas.height));

                for (var key in filtered) {
                    if (filtered.hasOwnProperty(key)) {
                        console.log(key + " -> " + filtered[key]);
                        myShaderMaterial.setFloat(key, filtered[key]);

                    }
                }

                myShaderMaterial.backFaceCulling = false;
                this.shaderMaterials.push(myShaderMaterial);

                var meshObj;
                console.log(mode);
                switch (mode) {
                    case "plane":
                        meshObj = BABYLON.MeshBuilder.CreatePlane("", {width: 20, height: 20}, this.scene); // default plane
                        break;
                    case "box":
                        meshObj = BABYLON.MeshBuilder.CreateBox("", {size: 20}, this.scene); // default plane
                        break;
                    case "sphere":
                        meshObj = BABYLON.MeshBuilder.CreateSphere("", {diameter: 20}, this.scene); // default plane
                        break;
                }
                meshObj.lookAt(this.scene.activeCamera.position);

                // meshObj.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
                meshObj.position = pickResult.pickedPoint;
                meshObj.position.y += 5;
                meshObj.material = myShaderMaterial;
                meshObj.showBoundingBox = true;
                this.gizmoManager.attachableMeshes.push(meshObj);

                let m = BABYLON.SceneSerializer.SerializeMesh(meshObj);

                // dispose due to bug causing some hydra not to be rendered until refresh
                // TODO: Update GizmoManager logic
                meshObj.dispose();

                this.socket.emit('new exhibit', {
                    id : this.socket.id,
                    mesh: m,
                    vertex: {
                        name: "customVertexShader",
                        code: BABYLON.Effect.ShadersStore["customVertexShader"]
                    },
                    fragment : {
                        name: "custom" +  this.socket.id + shaderCount + "FragmentShader",
                        code: BABYLON.Effect.ShadersStore["custom" +  this.socket.id + shaderCount + "FragmentShader"]
                    }
                });

                shaderCount++;

            } else {
                if (pickResult.hit) {
                    // Only allow the ground
                    if (pickResult.pickedMesh.id === "myGround"){
                        this.player.addDestination(pickResult);
                    }
                }
            }
        };

        // renders the scene 60 fps.
        this.engine.runRenderLoop(() => {
            if (this.scene) {
                // fps
                document.getElementById("fps").innerHTML = this.engine.getFps().toFixed() + " fps";

                if (this.shaderMaterials.length > 0) {
                    this.shaderMaterials.forEach(function (sd) {
                        sd.setFloat("time", time);
                    });
                    time += 0.02;
                }

                this.scene.render();
            }
        });
    }

    addPlayer(socket) {
        this.socket = socket;
        this.player = new Player(this.scene, this.socket);
    }

    addOtherPlayer(pos) {
        var myMaterial = new BABYLON.StandardMaterial("myMaterial", this.scene);
        myMaterial.diffuseColor = BABYLON.Color3.Random();
        let m = BABYLON.MeshBuilder.CreateBox("box", {height: 10}, this.scene);
        m.material = myMaterial;
        if (pos) m.position = pos;
        return m;
    }

    addMesh(mesh) {
        BABYLON.SceneLoader.ImportMesh('', '', `data:${JSON.stringify(mesh)}`, this.scene, (meshes) => {
            // Add materials to be rendered
            this.shaderMaterials.push(meshes[0].material);

            // Only meshes you make should be editable?
            // this.gizmoManager.attachableMeshes.push(meshes[0])
        })
    }

    addShader(vertex, fragment){
        BABYLON.Effect.ShadersStore[fragment.name] = fragment.code;
        BABYLON.Effect.ShadersStore[vertex.name] = vertex.code;
    }
}
