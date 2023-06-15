import * as BABYLON from "babylonjs";


/**
 * @param {BABYLON.Vector3} currentposition The current position of the camera.
 * @param {Array} planets The last position of the camera. 
 * @returns {BABYLON.Mesh} The planet closest to the camera.
*/
/*
export function findNearPlanets(currentposition, planets) {
    var nearPlanet = null;
    planets.forEach((planet) => {
        var planetDistance = calculateDistance(currentposition, planet.position);
        if(planetDistance <= 20) {
            console.log(planet)
            nearPlanet = planet;
        } else {
            nearPlanet = null;
        }
        return nearPlanet;
    });
}
*/
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
export function followPlanet(camera, planet, scene) {
    camera.position.x = planet.position.x + planet.diameter + 15;
    camera.position.z = planet.position.z + planet.diameter + 15;
    camera.position.y = planet.position.y + planet.diameter + 15;
    var target = new BABYLON.Vector3(planet.position.x, planet.position.y, planet.position.z);
    camera.setTarget(target);

}