// Import Babylon.js library
import * as BABYLON from 'babylonjs';

// Create function to create scenes
const createScene = (canvas) => {
    const engine = new BABYLON.Engine(canvas, true);
    const scene = new BABYLON.Scene(engine);
  
    // add camera
    // This creates and positions a free camera (non-mesh)}
    const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(1118, 60, 1118), scene);
    // add scene elements
    // ...
  
    // run render loop
    engine.runRenderLoop(() => {
      scene.render();
    });
  
    return scene;
  }

  export {createScene};