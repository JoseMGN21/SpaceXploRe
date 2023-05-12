import * as BABYLON from "babylonjs";

/**
 * @param {BABYLON.Vector3} currentposition The current position of the camera.
 * @param {BABYLON.Vector3} lastposition The last position of the camera. 
 */
export  function calculateDistance(currentposition, lastposition) {
    return BABYLON.Vector3.Distance(currentposition, lastposition);
}

/**
 * @param {BABYLON.FreeCamera} camera The camera to be moved.
 * @param {BABYLON.Mesh} planet The planet to be orbited.
 */
export function followPlanet(camera, planet) {
    camera.position.x = planet.position.x;
    camera.position.z = planet.position.z + 10;
    camera.position.y = planet.position.y;
    var target = new BABYLON.Vector3(planet.position.x + 1, planet.position.y - 3, planet.position.z - 2);
    camera.setTarget(target);

}