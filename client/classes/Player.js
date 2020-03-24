import * as BABYLON from 'babylonjs';

export default class Player {
    constructor(scene, socket, main) {
        var self = this;
        this.scene = scene;
        this.socket = socket;
        this.me = !!main;

        return this;
    }

    async initCharModel(position){
        let importedModel = await BABYLON.SceneLoader.ImportMeshAsync("", "assets/meshes/", "dummy3.babylon", this.scene);
        console.log(importedModel);

        this.skeleton = importedModel.skeletons[0];
        this.player = importedModel.meshes[0];
        this.player.scaling = new BABYLON.Vector3(5, 5, 5);
        this.player.checkCollisions = false;

        if (this.me) this.scene.activeCamera.lockedTarget = this.player;
        if (position) this.player.position = position;

        // ROBOT
        this.skeleton.animationPropertiesOverride = new BABYLON.AnimationPropertiesOverride();
        this.skeleton.animationPropertiesOverride.enableBlending = true;
        this.skeleton.animationPropertiesOverride.blendingSpeed = 0.05;
        this.skeleton.animationPropertiesOverride.loopMode = 1;

        this.idleRange = this.skeleton.getAnimationRange("YBot_Idle");
        this.walkRange = this.skeleton.getAnimationRange("YBot_Walk");
        this.runRange = this.skeleton.getAnimationRange("YBot_Run");

        // IDLE
        if (this.idleRange) this.scene.beginAnimation(this.skeleton, this.idleRange.from, this.idleRange.to, true);

        return this.player;
    }

    addDestination(pickResult){
        this.player.destination = pickResult.pickedPoint.clone();
        this.scene.beginAnimation(this.skeleton, this.walkRange.from, this.walkRange.to, true);
        this.player.lookAt(this.player.destination);
        this.player.rotation.x = 0;
        this.player.rotation.z = 0;


        // Decal
        var decalMaterial = new BABYLON.StandardMaterial("decalMat", this.scene);
        decalMaterial.diffuseTexture = new BABYLON.Texture("assets/textures/impact.png", this.scene);
        decalMaterial.diffuseTexture.hasAlpha = true;
        decalMaterial.zOffset = -2;
        var decalSize = new BABYLON.Vector3(10, 10, 10);
        var newDecal = BABYLON.Mesh.CreateDecal("decal", pickResult.pickedMesh, pickResult.pickedPoint, pickResult.getNormal(true), decalSize);
        newDecal.material = decalMaterial;

        // this.player.addRotation(0, Math.PI, 0);

        // var path = BABYLON.Mesh.CreateLines("lines", [
        //     this.player.position,
        //     this.player.destination
        // ], this.scene);
        // path.color = new BABYLON.Color3(0, 0, 1);
    }

    move(){
        if (this.player.destination) {
            var moveVector = this.player.destination.subtract(this.player.position);

            if (moveVector.length() > 1.1) {
                moveVector.y = -0.01;
                moveVector = moveVector.normalize();
                moveVector = moveVector.scale(0.2);
                // if(meshFound.distance > 1.1){
                //     moveVector.y = GRAVITY;
                // }
                this.player.moveWithCollisions(moveVector);

                if (this.socket){
                    this.socket.emit('player movement', {
                        id : this.socket.id,
                        position: this.player.position
                    });
                }
            } else {
                // Arrived
                if (this.idleRange) this.scene.beginAnimation(this.skeleton, this.idleRange.from, this.idleRange.to, true);
                this.player.destination = null;
            }
        }
    }
}
