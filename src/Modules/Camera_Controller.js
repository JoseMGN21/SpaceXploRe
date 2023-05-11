import * as BABYLON from "babylonjs";

/**
 * @param {BABYLON.Vector3} currentposition The current position of the camera.
 * @param {BABYLON.Vector3} lastposition The last position of the camera. 
 */
export  function calculateDistance(currentposition, lastposition) {
    return BABYLON.Vector3.Distance(currentposition, lastposition);
    }

