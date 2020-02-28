const Rock = require("./Rock.js");

const Game = function () {

    var engine = new BABYLON.NullEngine();
    this.scene = new BABYLON.Scene(engine);

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    function initScene() {
        this.scene.collisionsEnabled = true;
        this.scene.gravity = new BABYLON.Vector3(0, -9.81, 0);

        // Camera
        let camera = new BABYLON.ArcRotateCamera("Camera", 3 * Math.PI / 2, Math.PI / 2, 30, new BABYLON.Vector3(0, 3, 0), this.scene);
        camera.lowerBetaLimit = 0.1;
        camera.upperBetaLimit = (Math.PI / 2) * 0.9;
        camera.lowerRadiusLimit = 25;
        camera.collisionRadius = new BABYLON.Vector3(0.5, 0.5, 0.5);
        camera.checkCollisions = true;
        camera.useBouncingBehavior = true;

        // Ground
        var ground = BABYLON.MeshBuilder.CreateGround("myGround", {
            width: 4000,
            height: 4000,
            subdivisions: 50
        }, this.scene);
        ground.material = new BABYLON.StandardMaterial("ground", this.scene);
        ground.material.diffuseColor = BABYLON.Color3.FromInts(56, 75, 45);
        ground.material.specularColor = BABYLON.Color3.Black();
        ground.receiveShadows = true;
        ground.collisionsEnabled = true;
        ground.checkCollisions = true;
        ground.convertToFlatShadedMesh();

        // Fog
        this.scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
        this.scene.fogDensity = 0.0005;
        this.scene.fogColor = new BABYLON.Color3(0.6, 0.8, 0.75);

        // Lights
        var d = new BABYLON.DirectionalLight("dir", new BABYLON.Vector3(1, -1, -2), this.scene);
        d.position = new BABYLON.Vector3(-300, 300, 600);

        var h = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, -1), this.scene);
        h.intensity = 1;

        // TODO: Populate world...

        for (let i = 0; i < 100; i++){
            let rock = new Rock(getRandomInt(1, 20), this.scene);
            rock.position.x = getRandomInt(-1000, 1000);
            rock.position.z = getRandomInt(-1000, 1000);
        }

    }

    initScene();

    return this;
};

module.exports = Game;
