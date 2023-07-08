import * as BABYLON from 'babylonjs';
import * as materiales from '../Modules/Materials_Module.js';
import texturaSol from "../Resources/solar_system_textures/2k_sun.jpg";
import texturaMercurio from "../Resources/solar_system_textures/2k_mercury.jpg";
import texturaVenus from "../Resources/solar_system_textures/2k_venus_surface.jpg";
import texturaTierra from "../Resources/solar_system_textures/2k_earth_daymap.jpg";
import texturaLuna from "../Resources/solar_system_textures/2k_moon.jpg";
import texturaMarte from "../Resources/solar_system_textures/2k_mars.jpg";
import texturaJupiter from "../Resources/solar_system_textures/2k_jupiter.jpg";
import texturaSaturno from "../Resources/solar_system_textures/2k_saturn.jpg";
import texturaUrano from "../Resources/solar_system_textures/2k_uranus.jpg";
import texturaNeptuno from "../Resources/solar_system_textures/2k_neptune.jpg";
import texturaAnillosSaturno from "../Resources/solar_system_textures/2k_saturn_ring_alpha.png";



/**
 * @param {BABYLON.Scene} scene The instanced babylon scene.
 * @returns {BABYLON.Mesh} The instanced mesh of the planet.
 */
export function createAllPlanets(scene) {
    let planets = [];
    let firstSceneContainer = new BABYLON.AssetContainer(scene);
    let secondSceneContainer = new BABYLON.AssetContainer(scene);

    let sol = planetCreate(54, texturaSol, "sun", new BABYLON.Vector3.Zero, 0, scene);
    //planets.push(sol);
    let mercurio = planetCreate(0.382 * 5, texturaMercurio, "mercury", new BABYLON.Vector3(15,0,0), 0.1, scene);
    planets.push(mercurio);
    let venus = planetCreate(0.949 * 5, texturaVenus, "venus", new BABYLON.Vector3(20,0,0), 177, scene);
    planets.push(venus);
    let tierra = planetCreate(1 * 5, texturaTierra, "earth", new BABYLON.Vector3(25,0,0), 203, scene);
    planets.push(tierra);	
    let luna = planetCreate(0.2724 * 5, texturaLuna, "moon", new BABYLON.Vector3(27,0,0), 0, scene);
    //planets.push(luna);
    let marte = planetCreate(0.532 * 5, texturaMarte, "mars", new BABYLON.Vector3(30,0,0), 25, scene);
    planets.push(marte);
    let jupiter = planetCreate(11.209 * 5, texturaJupiter, "jupiter", new BABYLON.Vector3(40,0,0), 3, scene);
    planets.push(jupiter);
    let saturno = planetCreate(9.449 * 5, texturaSaturno, "saturn", new BABYLON.Vector3(50,0,0), 26, scene);
    planets.push(saturno);
    let anillosSaturno = planetCreate(9.449 * 5, texturaAnillosSaturno, "saturnRings", new BABYLON.Vector3(50,0,0), 26, scene);
    //planets.push(anillosSaturno);
    let urano = planetCreate(4.007 * 5, texturaUrano, "uranus", new BABYLON.Vector3(60,0,0), 82, scene);
    planets.push(urano);
    let neptuno = planetCreate(3.883 * 5, texturaNeptuno, "neptune", new BABYLON.Vector3(70,0,0), 28, scene);
    planets.push(neptuno);

    firstSceneContainer.meshes.push(mercurio);
    firstSceneContainer.meshes.push(venus);
    firstSceneContainer.meshes.push(tierra);
    firstSceneContainer.meshes.push(luna);
    firstSceneContainer.meshes.push(marte);
    secondSceneContainer.meshes.push(jupiter);
    secondSceneContainer.meshes.push(saturno);
    secondSceneContainer.meshes.push(anillosSaturno);
    secondSceneContainer.meshes.push(urano);
    secondSceneContainer.meshes.push(neptuno);

    return {sol, mercurio, venus, tierra, luna, marte, jupiter, saturno, anillosSaturno, urano, neptuno, planets, firstSceneContainer, secondSceneContainer};
}

/**
 * @param {BABYLON.Scene} scene The instanced babylon scene.
 * @returns {BABYLON.Mesh} The instanced mesh of the planet.
 */
export function createAllOrbits(scene) {
    let ua = 117.26846553048;
    let orbits = [];

    let orbitaMercurio = orbitCreate("mercurio", 0.38, ua, 88 * 5, 7, scene);
    orbits.push(orbitaMercurio.orbit);
    let orbitaVenus = orbitCreate("venus", 0.72, ua, 224 * 5, 3.4, scene);
    orbits.push(orbitaVenus.orbit);
    let orbitaTierra = orbitCreate("tierra", 1, ua, 365 * 5, 0, scene);
    orbits.push(orbitaTierra.orbit);
    let orbitaLuna = orbitCreate("luna", 0.0257 * 5, ua, 27 * 5, 0, scene);
    orbits.push(orbitaLuna.orbit);
    let orbitaMarte = orbitCreate("marte", 1.52, ua, 686, 1.85 * 5, scene);
    orbits.push(orbitaMarte.orbit);
    let orbitaJupiter = orbitCreate("jupiter", 5.20, ua, 4329 * 5, 1.3, scene);
    orbits.push(orbitaJupiter.orbit);
    let orbitaSaturno = orbitCreate("saturno", 9.54, ua, 10753 * 5, 2.49, scene);
    orbits.push(orbitaSaturno.orbit);
    let orbitaUrano = orbitCreate("urano", 19.22, ua, 30663 * 5, 0.77, scene);
    orbits.push(orbitaUrano.orbit);
    let orbitaNeptuno = orbitCreate("neptuno", 30.06, ua, 60148 * 5, 1.77, scene);
    orbits.push(orbitaNeptuno.orbit);
 
    return {orbitaMercurio, orbitaVenus, orbitaTierra, orbitaLuna, orbitaMarte, orbitaJupiter, orbitaSaturno, orbitaUrano, orbitaNeptuno, orbits};
}


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
    switch (planetName) {
        case "sun":
            var sun = BABYLON.MeshBuilder.CreateSphere(planetName, {diameter: diameter}, scene);
            sun.position = position;
            sun.material = materiales.MaterialFromTexture(planetName+"Texture", {diffuseTexture: texture}, scene);
            sun.material.emissiveColor = new BABYLON.Color3(1,1,1);
            sun.light = new BABYLON.PointLight("luzSol", new BABYLON.Vector3(0,0,0), scene);
            sun.light.intensity = 1;
            sun.checkCollisions = true;
            sun.diameter = diameter;
            return sun;
            break;
        case "saturnRings":
            var anillosSaturno = BABYLON.MeshBuilder.CreateTorus(planetName, {diameter: diameter, thickness: 8 * 5}, scene);
            anillosSaturno.position.set(0,0,0);
            anillosSaturno.material = materiales.MaterialFromTexture(planetName+"Texture", {diffuseTexture: texture}, scene);
            anillosSaturno.material.hasAlpha = true;
            anillosSaturno.checkCollisions = true;
            anillosSaturno.scaling = new BABYLON.Vector3(1,.0001,1);
            anillosSaturno.material.emissiveColor = new BABYLON.Color3(0.5,0.5,0.5);
            return anillosSaturno;
            break;
        case "moon":
            var moon = BABYLON.MeshBuilder.CreateSphere(planetName, {diameter: diameter}, scene);
            moon.position.set(0,0,0);
            moon.material = materiales.MaterialFromTexture(planetName+"texture", {diffuseTexture: texture}, scene);
            moon.checkCollisions = true;
            moon.rotation.z = Degrees_to_radians(rotation);
            moon.diameter = diameter;
            return moon;
        default:
            var planet = BABYLON.MeshBuilder.CreateSphere(planetName, {diameter: diameter}, scene);
            planet.position = position;
            planet.material = materiales.MaterialFromTexture(planetName+"texture", {diffuseTexture: texture}, scene);
            planet.checkCollisions = true;
            planet.rotation.z = Degrees_to_radians(rotation);
            planet.diameter = diameter;
            return planet;
            break;
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