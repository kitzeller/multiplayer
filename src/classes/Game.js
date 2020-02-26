import * as BABYLON from 'babylonjs';
import Player from './Player';
import * as $ from "jquery";

export default class Game {
    constructor(canvasId) {
        // get element from html file.
        const canvas = document.getElementById(canvasId);

        // initiate the engine.
        this.engine = new BABYLON.Engine(canvas, true);

        // create a scene.
        this.scene = new BABYLON.Scene(this.engine);
        this.scene.ambientColor = BABYLON.Color3.White();

        // set up a camera.
        this.camera = new BABYLON.ArcRotateCamera("Camera", 3 * Math.PI / 2, Math.PI / 4, 30, new BABYLON.Vector3(0, 3, 0), this.scene);
        this.camera.lowerBetaLimit = 0.1;
        this.camera.upperBetaLimit = (Math.PI / 2) * 0.9;
        this.camera.lowerRadiusLimit = 25;
        this.camera.collisionRadius = new BABYLON.Vector3(0.5, 0.5, 0.5);
        this.camera.checkCollisions = true;
        this.camera.useBouncingBehavior = true;
        this.camera.attachControl(canvas, true);

        // lights
        var d = new BABYLON.DirectionalLight("dir", new BABYLON.Vector3(1, -1, -2), this.scene);
        d.position = new BABYLON.Vector3(-300, 300, 600);

        var h = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, -1), this.scene);
        h.intensity = 1;

        // Fog
        this.scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
        this.scene.fogDensity = 0.0005;
        this.scene.fogColor = new BABYLON.Color3(0.6, 0.8, 0.75);


        // this.ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "assets/maps/heightmap.jfif", 4000, 4000, 50, -200, 800, this.scene, false, function () {});
        this.ground = BABYLON.MeshBuilder.CreateGround("myGround", {
            width: 4000,
            height: 4000,
            subdivisions: 50
        }, this.scene);
        this.ground.material = new BABYLON.StandardMaterial("ground", this.scene);
        this.ground.material.diffuseColor = BABYLON.Color3.FromInts(56, 75, 45);
        this.ground.material.specularColor = BABYLON.Color3.Black();
        this.ground.receiveShadows = true;
        this.ground.collisionsEnabled = true;
        this.ground.checkCollisions = true;
        this.ground.convertToFlatShadedMesh();

        this.scene.onPointerDown = (event, pickResult) => {
            if (pickResult.hit) {
                this.player.addDestination(pickResult);
            }
        };


        // renders the scene 60 fps.
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
    }

    addPlayer(socket) {
        this.socket = socket;
        this.player = new Player(this.scene, this.socket);
    }

    addOtherPlayer(pos){
        var myMaterial = new BABYLON.StandardMaterial("myMaterial", this.scene);
        myMaterial.diffuseColor = BABYLON.Color3.Random();
        let m = BABYLON.MeshBuilder.CreateBox("box", {height: 10}, this.scene);
        m.material = myMaterial;
        if (pos) m.position = pos;
        return m;

    }
}
