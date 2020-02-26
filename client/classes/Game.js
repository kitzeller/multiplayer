import * as BABYLON from 'babylonjs';
import Player from './Player';

export default class Game {
    constructor(canvasId, mesh) {
        // get element from html file.
        const canvas = document.getElementById(canvasId);

        // initiate the engine.
        this.engine = new BABYLON.Engine(canvas, true);

        // loads the scene.
        BABYLON.SceneLoader.Load('',  `data:${JSON.stringify(mesh.scene)}`, this.engine, scene => {
            this.scene = scene;
            this.scene.activeCamera.attachControl(canvas, true);
        });

        this.scene.onPointerDown = (event, pickResult) => {
            if (pickResult.hit) {
                this.player.addDestination(pickResult);
            }
        };

        // renders the scene 60 fps.
        this.engine.runRenderLoop(() => {
            if (this.scene){
                this.scene.render();
            }
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

    addMesh(mesh){
        // BABYLON.SceneLoader.ImportMesh('', '', `data:${JSON.stringify(mesh.sphere)}`, this.scene)  //correct
        // BABYLON.SceneLoader.ImportMesh('', '', `data:${JSON.stringify(mesh.ground)}`, this.scene, meshes => {
        //     console.log(meshes);
        // })  //correct

        // BABYLON.SceneLoader.Load('',  `data:${JSON.stringify(mesh.scene)}`, this.engine, scene => {
        //     this.scene = scene;
        // })  //correct
    }
}
