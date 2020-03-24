import * as BABYLON from 'babylonjs';

/**
 * WIP "Singleton" MeshLoader
 * Currently not in use
 */

class MeshLoader {

    constructor(){
    }

    init(scene){
        BABYLON.SceneLoader.LoadAssetContainer("./assets/meshes/", "dummy3.babylon", scene,  (container) => {
            this.meshes = container.meshes;
            this.materials = container.materials;
            //...
            // console.log(container.meshes);
            // Adds all elements to the scene
            // container.addAllToScene();
        });
    }

    getValue(){
        // return this.value;
        console.log(this.meshes);
    }
}

export default new MeshLoader()
