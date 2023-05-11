import * as BABYLON from 'babylonjs';
import * as materiales from '../Modules/Materials_Module.js';

/**
 * @param {int} diameter The diameter of the planet
 * @param {BABYLON.Texture} texture The texture of the planet.
 * @param {string} planetName The name of the planet.
 * @param {BABYLON.Vector3} position Initial position of the planet as a vector.
 * @param {int} rotation The rotation of the planet.
 * @param {BABYLON.Scene} scene The instanced babylon scene.
 * @returns {BABYLON.Mesh} The instanced mesh of the planet.
 */
export function planetCreate(diameter, texture, planetName, position, rotation, scene) {
    if(planetName == "sun"){
        var sun = BABYLON.MeshBuilder.CreateSphere(planetName, {diameter: diameter}, scene);
        sun.position = position;
        sun.material = materiales.MaterialFromTexture(planetName+"Texture", {diffuseTexture: texture}, scene);
        sun.material.emissiveColor = new BABYLON.Color3(1,1,1);
        sun.light = new BABYLON.PointLight("luzSol", new BABYLON.Vector3(0,0,0), scene);
        sun.light.intensity = 1;
        sun.checkCollisions = true;
        console.log(sun.position)
        return sun;
    }
    else {
        var planet = BABYLON.MeshBuilder.CreateSphere(planetName, {diameter: diameter}, scene);
        planet.position = position;
        planet.material = materiales.MaterialFromTexture(planetName+"texture", {diffuseTexture: texture}, scene);
        planet.checkCollisions = true;
        planet.rotation.z = Degrees_to_radians(rotation);
        console.log(planet.position)
        return planet;
    }
}

/**
 * @param {string} planetName The name of the planet whose orbit is being created.
 * @param {float} size The size of the orbit.
 * @param {float} ua The astronomic unit, used to calculate the scale of the orbit.
 * @param {int} points The number of points of the orbit. (This changes the traslation speed of the planet)
 * @param {int} rotation The rotation of the orbit in degrees.
 * @param {BABYLON.Scene} scene The instanced babylon scene.
 * @returns  The instanced mesh of the orbit.
 */
export function orbitCreate(planetName, ua, size, points, rotation, scene) {
    var deltaThetaOrbit = Math.PI / points;
    var orbitPoints = []; // Array of points to create the orbit
    for (var theta = 0; theta < 2 * Math.PI; theta += deltaThetaOrbit) {
        orbitPoints.push(new BABYLON.Vector3(ua * size * 0.8 * Math.sin(theta), 0, ua * size * Math.cos(theta)));
    }

    var orbit = BABYLON.MeshBuilder.CreateLines(planetName+"Orbit", { points: orbitPoints }, scene);
    orbit.color = BABYLON.Color3.Red();
    orbit.position = new BABYLON.Vector3(0, 0, 0)
    orbit.rotation.z = Degrees_to_radians(rotation);

    return {orbit, orbitPoints}; 
}

function Degrees_to_radians(degrees) {
    var pi = Math.PI;
    return degrees * (pi/180);
}