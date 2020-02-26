import * as BABYLON from 'babylonjs';

export default class Player {
    constructor(scene, socket) {
        var self = this;
        this.scene = scene;
        this.socket = socket;
        this.player = BABYLON.MeshBuilder.CreateBox("box", {height: 5}, this.scene);

        this.scene.registerBeforeRender( () => {
            if(this.scene.isReady()){
                this.move();
            }
        });
    }

    addDestination(pickResult){
        this.player.destination = pickResult.pickedPoint.clone();
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
                this.player.destination = null;
            }
        }
    }
}
