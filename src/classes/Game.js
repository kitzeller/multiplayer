import * as BABYLON from 'babylonjs';

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
        this.camera = new BABYLON.ArcRotateCamera(
            'camera',
            Math.PI / 2,
            Math.PI / 3,
            25,
            BABYLON.Vector3.Zero(),
            this.scene
        );






        // renders the scene 60 fps.
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
    }
}
