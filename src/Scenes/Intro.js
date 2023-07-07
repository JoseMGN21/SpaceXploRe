import React from "react";
import * as BABYLON from "babylonjs";
import MATERIALS from "babylonjs-materials";
import { SkyMaterial } from "babylonjs-materials";
import SceneComponent from "../Babylon_components/SceneComponent";
import * as earcut from "earcut";
import * as materiales from "../Modules/Materials_Module";
import * as luces from "../Modules/Lights_Module";
import * as XR_Module from "../Modules/XR_Module";
import * as Questions_Module from "../Modules/Questions_Module";
import * as AV from "../Modules/AV_module";
import { PlayGround } from "../Babylon_components/PlayGround.js";
import skyTexture from "../Resources/solar_system_textures/2k_stars_milky_way.jpg";
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
import videoStartScreen from "../Resources/xplore_start_screen.mp4";
import gifStartScreen from "../Resources/xplore_start_screen_gif.gif";
import waving1 from "../Resources/waving_gif/tile000.png";
import waving2 from "../Resources/waving_gif/tile002.png";
import waving3 from "../Resources/waving_gif/tile004.png";
import waving4 from "../Resources/waving_gif/tile006.png";
import waving5 from "../Resources/waving_gif/tile008.png";
import waving6 from "../Resources/waving_gif/tile010.png";
import waving7 from "../Resources/waving_gif/tile012.png";
import waving8 from "../Resources/waving_gif/tile014.png";
import uiEjemplo from "../Resources/guiTextureEjemplo.json"
import mainUI from "../Resources/mainScreenGUI2.json"
import configGUI from "../Resources/configGUI.json"
import startScreenGUI from "../Resources/startScreenGUI.json"
import planetInfoGUI from "../Resources/planetInfoGUI.json"
import textBoxGUI from "../Resources/textBoxGUI.json"
import questionsGUI from "../Resources/questionsGUI.json"
import * as scenes from "../Modules/Scene_Manager_Module"
import * as GUI from "babylonjs-gui"
import * as planetConstructor from "../Modules/Planet_Constructor_Module"
import * as UI from "../Modules/UI_Manager_Module"
import * as  camController from "../Modules/Camera_Controller"
import { Await } from "react-router-dom";
import questionsJSON from '../Resources/questions.json';



const onSceneReady = async (e = {engine: new BABYLON.Engine, scene: new BABYLON.Scene, canvas: new HTMLCanvasElement }) => {

    var configUIElements = [];
    var mainUIElements = [];
    var startScreenUIElements = [];
    var textBoxUIElements = [];
    var questionsUIElements = [];
    var wavingGIFElements = [];
    var planetInfoUIElements = [];
    var confirmButtonsUIElements = [];
    var orbits = [];
    var planets = [];	
    var visitedPlanets = [];
    var shownQuestions = [];
    var firstSceneContainer = new BABYLON.AssetContainer(e.scene);
    var secondSceneContainer = new BABYLON.AssetContainer(e.scene);
    let movedKM = 0;
    let moving = false;
    let elapsedTime = 0;
    let fuel = 1000;
    var acceleration = 0;
    let lastPosition = new BABYLON.Vector3.Zero;
    var wavingGifIndex = 0;
    //var dialogOn = false;
    var planet = null;
    var started = false;
    var nearPlanet = null;
    var anchored = false;
    var questionAnswered = false;
    var showingQuestionFuel = false;
    var UIshown = "startScreen";
    let question = null;
    let incorrectAnswers = 0;
    let partOneAnswered = false;
    let showingQuestionPartOne = false;
    let correctAnswers = 0;
    let testOneAvailable = false;
    let neededKmToTest = 500;
    let questionShown = false;
    let showingPlanetAnchor = false;

    var ARenabled = false;
    var xrCamera = null;

    let XR_experienceReturns = null;

    //const assetsManager = new BABYLON.AssetsManager(scene);


    const { canvas, scene, engine } = e;
    // This creates and positions a free camera (non-mesh)}
    const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(200, 60, 200), scene);
    camera.inputs.clear();
    camera.inputs.add(new BABYLON.FreeCameraMouseInput())
    //camera.physicsImpostor = new BABYLON.PhysicsImpostor(camera, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, restitution: 0.9 }, scene);
    lastPosition.x = camera.position.x;
    lastPosition.y = camera.position.y;
    lastPosition.z = camera.position.z;

    // This targets the camera to scene origin
    camera.setTarget(new BABYLON.Vector3(0, 0, 0));

    // This attaches the camera to the canvas
    camera.attachControl(canvas, false);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    luces.SpotLight(scene);

    light.intensity = 0.4;
    light.diffuse = new BABYLON.Color3(0,0.2,0.4);

    scene.collitionsEnabled = true;
    camera.checkCollisions = true;


    var playground = PlayGround({ playground_width: 10000, playground_depth: 10000, walls_height: 1000 }, scene)
    playground.collitionsEnabled = true;
    
    // Sky material
    var skyboxMaterial = new BABYLON.StandardMaterial("skyMaterial", scene);
    skyboxMaterial.emissiveTexture = new BABYLON.Texture(skyTexture, scene);
    skyboxMaterial.backFaceCulling = false;
    
    

    // Sky mesh (box)
    var skybox = BABYLON.Mesh.CreateBox("skyBox", 9000, scene);
    skybox.material = skyboxMaterial;

    skybox.material.inclination = -0.35;

    /*
    var skyboxTexture = new BABYLON.CubeTexture("../Resources/solar_system_textures/MilkyWayTexture.jpg", scene);
    skyboxMaterial.reflectionTexture = skyboxTexture;
*/

/*
// Skybox
    var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {width:10000.0, depth: 10000, height: 500}, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(skyTexture, scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    //skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    //skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;
*/



    var sol = planetConstructor.planetCreate(54, texturaSol, "sun", new BABYLON.Vector3.Zero, 0, scene);
    //console.log("diametro del sol" + sol.Mesh.diameter);
    //planets.push(sol);
    //console.log(sol.position);
    var mercurio = planetConstructor.planetCreate(0.382 * 5, texturaMercurio, "mercury", new BABYLON.Vector3(15,0,0), 0.1, scene);
    planets.push(mercurio);
    firstSceneContainer.meshes.push(mercurio);
    var venus = planetConstructor.planetCreate(0.949 * 5, texturaVenus, "venus", new BABYLON.Vector3(20,0,0), 177, scene);
    planets.push(venus);
    firstSceneContainer.meshes.push(venus);
    var tierra = planetConstructor.planetCreate(1 * 5, texturaTierra, "earth", new BABYLON.Vector3(25,0,0), 203, scene);
    planets.push(tierra);	
    firstSceneContainer.meshes.push(tierra);
    var luna = planetConstructor.planetCreate(0.2724 * 5, texturaLuna, "moon", new BABYLON.Vector3(27,0,0), 0, scene);
    //planets.push(luna);
    firstSceneContainer.meshes.push(luna);
    var marte = planetConstructor.planetCreate(0.532 * 5, texturaMarte, "mars", new BABYLON.Vector3(30,0,0), 25, scene);
    planets.push(marte);
    firstSceneContainer.meshes.push(marte);
    var jupiter = planetConstructor.planetCreate(11.209 * 5, texturaJupiter, "jupiter", new BABYLON.Vector3(40,0,0), 3, scene);
    planets.push(jupiter);
    secondSceneContainer.meshes.push(jupiter);
    var saturno = planetConstructor.planetCreate(9.449 * 5, texturaSaturno, "saturn", new BABYLON.Vector3(50,0,0), 26, scene);
    planets.push(saturno);
    secondSceneContainer.meshes.push(saturno);
    var anillosSaturno = planetConstructor.planetCreate(9.449 * 5, texturaAnillosSaturno, "saturnRings", new BABYLON.Vector3(50,0,0), 26, scene);
    //planets.push(anillosSaturno);
    secondSceneContainer.meshes.push(anillosSaturno);
    var urano = planetConstructor.planetCreate(4.007 * 5, texturaUrano, "uranus", new BABYLON.Vector3(60,0,0), 82, scene);
    planets.push(urano);
    secondSceneContainer.meshes.push(urano);
    var neptuno = planetConstructor.planetCreate(3.883 * 5, texturaNeptuno, "neptune", new BABYLON.Vector3(70,0,0), 28, scene);
    planets.push(neptuno);
    secondSceneContainer.meshes.push(neptuno);

    var ua = 117.26846553048;

    var orbitaMercurio = planetConstructor.orbitCreate("mercurio", 0.38, ua, 88 * 5, 7, scene);
    orbits.push(orbitaMercurio.orbit);
    var orbitaVenus = planetConstructor.orbitCreate("venus", 0.72, ua, 224 * 5, 3.4, scene);
    orbits.push(orbitaVenus.orbit);
    var orbitaTierra = planetConstructor.orbitCreate("tierra", 1, ua, 365 * 5, 0, scene);
    orbits.push(orbitaTierra.orbit);
    var orbitaLuna = planetConstructor.orbitCreate("luna", 0.0257 * 5, ua, 27 * 5, 0, scene);
    orbits.push(orbitaLuna.orbit);
    var orbitaMarte = planetConstructor.orbitCreate("marte", 1.52, ua, 686, 1.85 * 5, scene);
    orbits.push(orbitaMarte.orbit);
    var orbitaJupiter = planetConstructor.orbitCreate("jupiter", 5.20, ua, 4329 * 5, 1.3, scene);
    orbits.push(orbitaJupiter.orbit);
    var orbitaSaturno = planetConstructor.orbitCreate("saturno", 9.54, ua, 10753 * 5, 2.49, scene);
    orbits.push(orbitaSaturno.orbit);
    var orbitaUrano = planetConstructor.orbitCreate("urano", 19.22, ua, 30663 * 5, 0.77, scene);
    orbits.push(orbitaUrano.orbit);
    var orbitaNeptuno = planetConstructor.orbitCreate("neptuno", 30.06, ua, 60148 * 5, 1.77, scene);
    orbits.push(orbitaNeptuno.orbit);
    mercurio.parent = orbitaMercurio.orbit;
    var movimientoMercurio = 0;
    venus.parent = orbitaVenus.orbit;
    var movimientoVenus = 0;
    tierra.parent = orbitaTierra.orbit;
    var movimientoTierra = 0;
    orbitaLuna.orbit.parent = tierra;
    luna.parent = orbitaLuna.orbit;
    var movimientoLuna = 0;
    marte.parent = orbitaMarte.orbit;
    var movimientoMarte = 0;
    jupiter.parent = orbitaJupiter.orbit;
    var movimientoJupiter = 0;
    saturno.parent = orbitaSaturno.orbit;
    anillosSaturno.parent = saturno;
    var movimientoSaturno = 0;
    urano.parent = orbitaUrano.orbit;
    var movimientoUrano = 0;
    neptuno.parent = orbitaNeptuno.orbit;
    var movimientoNeptuno = 0;

    let advancedTextureMain = GUI.AdvancedDynamicTexture.CreateFullscreenUI("mainUI", true, scene);
    let advancedTextureConfig = GUI.AdvancedDynamicTexture.CreateFullscreenUI("configUI", true, scene);
    let advancedTextureStartScreen = GUI.AdvancedDynamicTexture.CreateFullscreenUI("startScreenUI", true, scene);
    let advancedTextureTextBox = GUI.AdvancedDynamicTexture.CreateFullscreenUI("textBoxUI", true, scene);
    let advancedTexturePlanetInfo = GUI.AdvancedDynamicTexture.CreateFullscreenUI("planetInfoUI", true, scene);
    let advancedTextureQuestions = GUI.AdvancedDynamicTexture.CreateFullscreenUI("questionsUI", true, scene);

    // Set the ideal W and H if you wish to scale with the window.
    advancedTextureMain.idealWidth = 1920;
    advancedTextureMain.idealHeight = 1080;
    advancedTextureConfig.idealWidth = 1920;
    advancedTextureConfig.idealHeight = 1080;

    let loadedGUI = await advancedTextureMain.parseSerializedObject(mainUI);
    let loadedGUIConfig = await advancedTextureConfig.parseSerializedObject(configGUI);
    let loadedGUIStartScreen = await advancedTextureStartScreen.parseSerializedObject(startScreenGUI);
    let loadedGUITextBox = await advancedTextureTextBox.parseSerializedObject(textBoxGUI);
    let loadedGUIPlanetInfo = await advancedTexturePlanetInfo.parseSerializedObject(planetInfoGUI);
    let loadedGUIQuestions = await advancedTextureQuestions.parseSerializedObject(questionsGUI);

    advancedTextureMain.addControl(loadedGUI);
    advancedTextureConfig.addControl(loadedGUIConfig);
    advancedTextureStartScreen.addControl(loadedGUIStartScreen);
    advancedTextureTextBox.addControl(loadedGUITextBox);  
    advancedTexturePlanetInfo.addControl(loadedGUIPlanetInfo);
    advancedTextureQuestions.addControl(loadedGUIQuestions);

    configUIElements.push(advancedTextureConfig.getControlByName("BackgroundImage"));
    configUIElements.push(advancedTextureConfig.getControlByName("SliderSize"));
    configUIElements.push(advancedTextureConfig.getControlByName("CheckboxSound"));
    configUIElements.push(advancedTextureConfig.getControlByName("CheckboxShowOrbits"));  
    configUIElements.push(advancedTextureConfig.getControlByName("ColorPickerOrbits"));
    configUIElements.push(advancedTextureConfig.getControlByName("TextblockSize"));    
    configUIElements.push(advancedTextureConfig.getControlByName("ButtonClose"));  
    mainUIElements.push(advancedTextureMain.getControlByName("BotonConfig"));
    mainUIElements.push(advancedTextureMain.getControlByName("KmTextblock"));
    mainUIElements.push(advancedTextureMain.getControlByName("FuelTextblock"));
    mainUIElements.push(advancedTextureMain.getControlByName("Button"));
    mainUIElements.push(advancedTextureMain.getControlByName("Rectangle"));
    mainUIElements.push(advancedTextureMain.getControlByName("SliderTierra"));
    mainUIElements.push(advancedTextureMain.getControlByName("TextblockPlanetas"));
    textBoxUIElements.push(advancedTextureTextBox.getControlByName("DialogBox"));
    textBoxUIElements.push(advancedTextureTextBox.getControlByName("DialogText"));
    textBoxUIElements.push(advancedTextureTextBox.getControlByName("RobotImage"));
    textBoxUIElements.push(advancedTextureTextBox.getControlByName("ClickText"));
    confirmButtonsUIElements.push(advancedTextureTextBox.getControlByName("ButtonYes"));
    confirmButtonsUIElements.push(advancedTextureTextBox.getControlByName("ButtonNo"));
    planetInfoUIElements.push(advancedTexturePlanetInfo.getControlByName("PlanetInfo"));
    planetInfoUIElements.push(advancedTexturePlanetInfo.getControlByName("ButtonBack"));
    questionsUIElements.push(advancedTextureQuestions.getControlByName("QuestionText"));
    questionsUIElements.push(advancedTextureQuestions.getControlByName("ButtonOp1"));
    questionsUIElements.push(advancedTextureQuestions.getControlByName("TextblockOp1"));
    questionsUIElements.push(advancedTextureQuestions.getControlByName("ButtonOp2"));
    questionsUIElements.push(advancedTextureQuestions.getControlByName("TextblockOp2"));
    questionsUIElements.push(advancedTextureQuestions.getControlByName("ButtonOp3"));
    questionsUIElements.push(advancedTextureQuestions.getControlByName("TextblockOp3"));
    questionsUIElements.push(advancedTextureQuestions.getControlByName("ButtonOp4"));
    questionsUIElements.push(advancedTextureQuestions.getControlByName("TextblockOp4"));
    questionsUIElements.push(advancedTextureQuestions.getControlByName("Background"));
    questionsUIElements.push(advancedTextureQuestions.getControlByName("SliderFuel"));
    questionsUIElements.push(advancedTextureQuestions.getControlByName("TextSliderFuel"));



    advancedTextureConfig.getControlByName("BackgroundImage").isVisible = false;
    advancedTextureConfig.getControlByName("SliderSize").isVisible = false;
    advancedTextureConfig.getControlByName("CheckboxSound").isVisible = false;
    advancedTextureConfig.getControlByName("CheckboxShowOrbits").isVisible = false;
    advancedTextureConfig.getControlByName("ColorPickerOrbits").isVisible = false;
    advancedTextureConfig.getControlByName("TextblockSize").isVisible = false;
    advancedTextureConfig.getControlByName("ButtonClose").isVisible = false;

    wavingGIFElements.push(waving1);
    wavingGIFElements.push(waving2);
    wavingGIFElements.push(waving3);
    wavingGIFElements.push(waving4);
    wavingGIFElements.push(waving5);
    wavingGIFElements.push(waving6);
    wavingGIFElements.push(waving7);
    wavingGIFElements.push(waving8);

    let backgroundStart = advancedTextureStartScreen.getControlByName("BackgroundGIF");
    backgroundStart.isVisible = true;

    let botonConfig = advancedTextureMain.getControlByName("BotonConfig");
    botonConfig.isVisible = true;

    let botonAcelerar = advancedTextureMain.getControlByName("Button");

    let botonClose = advancedTextureConfig.getControlByName("ButtonClose");

    let botonOrbitas = advancedTextureConfig.getControlByName("CheckboxShowOrbits");

    let sliderSize = advancedTextureConfig.getControlByName("SliderSize");

    let TextblockSize = advancedTextureConfig.getControlByName("TextblockSize");

    let kmTextBlock = advancedTextureMain.getControlByName("KmTextblock");

    let fuelTextBlock = advancedTextureMain.getControlByName("FuelTextblock");

    let accelerator = advancedTextureMain.getControlByName("Button");
    
    let sliderFigura = advancedTextureMain.getControlByName("SliderTierra");

    let colorPicker = advancedTextureConfig.getControlByName("ColorPickerOrbits");

    let clickText = advancedTextureTextBox.getControlByName("ClickText");

    let robotImage = advancedTextureTextBox.getControlByName("RobotImage");

    let dialogText = advancedTextureTextBox.getControlByName("DialogText");

    let botonYes = advancedTextureTextBox.getControlByName("ButtonYes");

    let botonNo = advancedTextureTextBox.getControlByName("ButtonNo");

    let buttonBack = advancedTexturePlanetInfo.getControlByName("ButtonBack");

    let planetInfo = advancedTexturePlanetInfo.getControlByName("PlanetInfo");

    let fuelSlider = advancedTextureQuestions.getControlByName("SliderFuel");

    let fuelSliderText = advancedTextureQuestions.getControlByName("TextSliderFuel");

    let botonOp1 = advancedTextureQuestions.getControlByName("ButtonOp1");
    let botonOp2 = advancedTextureQuestions.getControlByName("ButtonOp2");
    let botonOp3 = advancedTextureQuestions.getControlByName("ButtonOp3");
    let botonOp4 = advancedTextureQuestions.getControlByName("ButtonOp4");

    UI.hideUI(configUIElements);
    UI.hideUI(mainUIElements);
    UI.hideUI(planetInfoUIElements);
    UI.hideUI(questionsUIElements);
    UI.showUI(textBoxUIElements);
    botonYes.isVisible = false;
    botonNo.isVisible = false;
    //dialogOn = true;
    backgroundStart.isVisible = false;


    let color = new BABYLON.Color3(1,1,1);
    let figura;
    let enfoque = nearPlanet;
    let objx;
    let objy;
    let objz;

    var {xrExperience, xrCamera, ARenabled} = await XR_Module.XR_Experience(playground.ground, skybox, camera, scene);

    scene.registerBeforeRender(async function () {
      if (xrExperience.baseExperience.state === BABYLON.WebXRState.IN_XR) {
        //<console.log("in xr");
      }



        //Choosing which UI to show
        switch (UIshown) {
          case "main":
            UI.hideUI(startScreenUIElements);
            UI.showUI(mainUIElements);
            UI.hideUI(configUIElements);
            UI.hideUI(planetInfoUIElements);
            UI.hideUI(questionsUIElements);
            UI.hideUI(textBoxUIElements);
            break;
          
          case "config":
            UI.hideUI(startScreenUIElements);
            UI.hideUI(mainUIElements);
            UI.showUI(configUIElements);
            UI.hideUI(planetInfoUIElements);
            UI.hideUI(questionsUIElements);
            UI.hideUI(textBoxUIElements);
            break;

          case "planetInfo":
            UI.hideUI(startScreenUIElements);
            UI.hideUI(mainUIElements);
            UI.hideUI(configUIElements);
            UI.showUI(planetInfoUIElements);
            UI.hideUI(questionsUIElements);
            UI.hideUI(textBoxUIElements);
            break;

          case "questions":
            UI.hideUI(startScreenUIElements);
            UI.hideUI(mainUIElements);
            UI.hideUI(configUIElements);
            UI.hideUI(planetInfoUIElements);
            UI.showUI(questionsUIElements);
            UI.hideUI(textBoxUIElements);
            break;

          case "textBox":
            UI.hideUI(startScreenUIElements);
            UI.hideUI(mainUIElements);
            UI.hideUI(configUIElements);
            UI.hideUI(planetInfoUIElements);
            UI.hideUI(questionsUIElements);
            UI.showUI(textBoxUIElements);
            break;

          case "startScreen":
            UI.showUI(startScreenUIElements);
            UI.hideUI(mainUIElements);
            UI.hideUI(configUIElements);
            UI.hideUI(planetInfoUIElements);
            UI.hideUI(questionsUIElements);
            UI.showUI(textBoxUIElements);
            break;
        
          default:
            UI.showUI(startScreenUIElements);
            UI.hideUI(mainUIElements);
            UI.hideUI(configUIElements);
            UI.hideUI(planetInfoUIElements);
            UI.hideUI(questionsUIElements);
            UI.hideUI(textBoxUIElements);
            break;
        }

        var deltaTimeInsecs = (scene.getEngine().getDeltaTime()) / 1000;
        elapsedTime += deltaTimeInsecs;
        if(elapsedTime >= .1 && !ARenabled){
          var alphaVisible = true;
          var direction = camera.getDirection(BABYLON.Axis.Z);
          if(planet == null)
          movedKM += camController.calculateDistance(camera.position,lastPosition);
          kmTextBlock.text = "Kilometros recorridos: " + movedKM.toFixed(2)
          lastPosition.x = camera.position.x;
          lastPosition.y = camera.position.y;
          lastPosition.z = camera.position.z;
          elapsedTime = 0;
          if(moving == true){
            if(acceleration < 100){
              acceleration += 1;
            } 
          fuel -= 1;
          fuelTextBlock.text = "Combustible restante: " + fuel;
          } else {
            if(acceleration > 0){
              acceleration -= 1;
            }
            }
            camera.position.addInPlace(direction.scale(0.1*acceleration));

          if(alphaVisible == true){
            clickText.alpha -= 0.1;
            if(clickText.alpha <= 0){
              alphaVisible = false;
              clickText.alpha = 0.9;
            }
          }
        } else if(elapsedTime >= .1 && ARenabled){
          var alphaVisible = true;
          var direction =  xrExperience.input.xrCamera.getDirection(BABYLON.Axis.Z);
          if(planet == null)
            movedKM += camController.calculateDistance( xrExperience.input.xrCamera.position,lastPosition);
          kmTextBlock.text = "Kilometros recorridos: " + movedKM.toFixed(2)
          lastPosition.x = xrExperience.input.xrCamera.position.x;
          lastPosition.y = xrExperience.input.xrCamera.position.y;
          lastPosition.z = xrExperience.input.xrCamera.position.z;
          elapsedTime = 0;
          if(moving == true){
            if(acceleration < 100){
              acceleration += 1;
            } 
          fuel -= 1;
          fuelTextBlock.text = "Combustible restante: " + fuel;
          } else {
            if(acceleration > 0){
              acceleration -= 1;
            }
            }
            camera.position.addInPlace(direction.scale(0.1*acceleration));

          if(alphaVisible == true){
            clickText.alpha -= 0.1;
            if(clickText.alpha <= 0){
              alphaVisible = false;
              clickText.alpha = 0.9;
            }
          }
        }

        if(fuel <= 0 && UIshown == "main"){
          fuel = 0;
          dialogText.text = "Te has quedado sin combustible, para recargar deberás responder una pregunta";
          UIshown = "textBox";
        }

        
        if(visitedPlanets.length >=1 && movedKM >= (neededKmToTest - 450) && !partOneAnswered && UIshown !== "planetInfo" && nearPlanet == null){
          testOneAvailable = true;
          //console.log("Preguntas test 1")
          dialogText.text = "Has visitado los planetas rocosos, ¿Quieres responder un test para desbloquear los planetas gaseosos?"
          UIshown = "textBox";
          UI.showUI(confirmButtonsUIElements)
          clickText.isVisible = false;
        }
  
        if(showingQuestionPartOne){
          //console.log("Mostrando pregunta test 1")
          fuelSlider.isVisible = false;
          fuelSliderText.isVisible = false;
          UIshown = "questions";
          if(!questionShown){
            console.log("Mostrando pregunta test 1")
            while(true){
            question = Questions_Module.showQuestion(visitedPlanets, advancedTextureQuestions, scene);
            var questionInArray = false;
            shownQuestions.forEach(shownquestion => {
              if(shownquestion == question)
                questionInArray = true;
            });
            if(!questionInArray)
              break;
            }
            shownQuestions.push(question);
            console.log(shownQuestions)
          }
          questionShown = true;
        }

        if(correctAnswers >= 3 && !partOneAnswered && shownQuestions.length >= 5){
          showingQuestionPartOne = false;
          console.log("Preguntas test 1 respondidas")
          partOneAnswered = true;
          dialogText.text = "Has desbloqueado los planetas gaseosos, ¡Sigue explorando!"
          UIshown = "textBox";
          UI.hideUI(confirmButtonsUIElements);
          incorrectAnswers = 0;
          correctAnswers = 0;
        } else if(correctAnswers < 3 && !partOneAnswered && shownQuestions.length >= 5){
          showingQuestionPartOne = false;
          console.log("Preguntas test 1 respondidas")
          partOneAnswered = true;
          dialogText.text = "No has desbloqueado los planetas gaseosos, ¡Sigue explorando!"
          UIshown = "textBox";
          UI.hideUI(confirmButtonsUIElements);
          visitedPlanets = [];
          neededKmToTest += 500;
          shownQuestions = [];
          incorrectAnswers = 0;
          correctAnswers = 0;
        }
//TODO: ShownQuestions para registrar que se respondieron las preguntas
        if(shownQuestions.length == 5 && showingQuestionFuel){
          console.log("Preguntas test 1 respondidas")
          showingQuestionFuel = false;
          UIshown = "main";
          incorrectAnswers = 0;
          shownQuestions = [];
          correctAnswers = 0;
        }

        fuelSlider.value = fuel;
        fuelSliderText.text = "Combustible: " + fuel + " %";

        if(showingQuestionFuel){
          UIshown = "questions";
          UI.hideUI(confirmButtonsUIElements);
          if(!questionShown){
            console.log("Mostrando pregunta test combustible")
            while(true){
            question = Questions_Module.showQuestion(visitedPlanets, advancedTextureQuestions, scene);
            var questionInArray = false;
            shownQuestions.forEach(shownquestion => {
              if(shownquestion == question)
                questionInArray = true;
            });
            if(!questionInArray)
              break;
            }
            shownQuestions.push(question);
            console.log(shownQuestions)
          }
          questionShown = true;
        } 

      /*
        if(elapsedTime >= .1){
          robotImage.source = wavingGIFElements[wavingGifIndex]
          wavingGifIndex += 1;
          console.log(wavingGifIndex)
          if(wavingGifIndex >= 8){
            wavingGifIndex = 0;
          }
        }*/
        
        planets.forEach((planet) => {
          var planetDistance = camController.calculateDistance(camera.position, planet.position);
          if(planetDistance <= (10 + planet.diameter)) {
              nearPlanet = planet;
          } else if (nearPlanet == planet){
            nearPlanet = null;
          }
        });

        if(nearPlanet !== null && UIshown == "main"){
          dialogText.text = "Estas en el planeta: " +  nearPlanet.name +", ¿deseas anclarte a su órbita?"
          anchored = true;
          UIshown = "textBox";
          UI.showUI(confirmButtonsUIElements);
          clickText.isVisible = false;
          showingPlanetAnchor = true;
        } else if(nearPlanet == null && UIshown == "textBox" && !testOneAvailable && fuel > 0){
          UIshown = "main";
          UI.hideUI(confirmButtonsUIElements);
          showingPlanetAnchor = false;
        }
        /*else if (started && fuel > 0 && !testOneAvailable){
          console.log("Hiding text box UI")
          botonYes.isVisible = false;
          botonNo.isVisible = false;
          UI.hideUI(textBoxUIElements);
        } else {
          UI.hideUI(mainUIElements);
          UI.showUI(startScreenUIElements);
        }*/
        
        if(planet != null){
          camController.followPlanet(camera,planet,scene);
        }
        
        //Rotación de los planetas
      
        sol.rotate(BABYLON.Axis.Y, 0.0033 * deltaTimeInsecs, BABYLON.Space.LOCAL);
        mercurio.rotate(BABYLON.Axis.Y, 0.0017 * deltaTimeInsecs, BABYLON.Space.LOCAL);
        venus.rotate(BABYLON.Axis.Y, 0.0004115 * deltaTimeInsecs, BABYLON.Space.LOCAL);
        tierra.rotate(BABYLON.Axis.Y, 0.1 * deltaTimeInsecs, BABYLON.Space.LOCAL);
        luna.rotate(BABYLON.Axis.Y, 0.0037 * deltaTimeInsecs, BABYLON.Space.LOCAL);
        marte.rotate(BABYLON.Axis.Y, 0.09708 * deltaTimeInsecs, BABYLON.Space.LOCAL);
        jupiter.rotate(BABYLON.Axis.Y, 0.2415 * deltaTimeInsecs, BABYLON.Space.LOCAL);
        saturno.rotate(BABYLON.Axis.Y, 0.2347 * deltaTimeInsecs, BABYLON.Space.LOCAL);
        anillosSaturno.rotate(BABYLON.Axis.Y, 0.2347 * deltaTimeInsecs, BABYLON.Space.LOCAL);
        urano.rotate(BABYLON.Axis.Y, 0.1392 * deltaTimeInsecs, BABYLON.Space.LOCAL);
        neptuno.rotate(BABYLON.Axis.Y, 0.1490 * deltaTimeInsecs, BABYLON.Space.LOCAL);
       
        // orbitaLuna.rotation.y += 0.1;


        //Movimiento de los planetas
        mercurio.position.x = orbitaMercurio.orbitPoints[movimientoMercurio].x
        mercurio.position.z = orbitaMercurio.orbitPoints[movimientoMercurio].z
        venus.position.x = orbitaVenus.orbitPoints[movimientoVenus].x
        venus.position.z = orbitaVenus.orbitPoints[movimientoVenus].z
        tierra.position.x = orbitaTierra.orbitPoints[movimientoTierra].x
        tierra.position.z = orbitaTierra.orbitPoints[movimientoTierra].z
        luna.position.x = orbitaLuna.orbitPoints[movimientoLuna].x
        luna.position.z = orbitaLuna.orbitPoints[movimientoLuna].z
        marte.position.x = orbitaMarte.orbitPoints[movimientoMarte].x
        marte.position.z = orbitaMarte.orbitPoints[movimientoMarte].z
        jupiter.position.x = orbitaJupiter.orbitPoints[movimientoJupiter].x
        jupiter.position.z = orbitaJupiter.orbitPoints[movimientoJupiter].z
        saturno.position.x = orbitaSaturno.orbitPoints[movimientoSaturno].x
        saturno.position.z = orbitaSaturno.orbitPoints[movimientoSaturno].z
        urano.position.x = orbitaUrano.orbitPoints[movimientoUrano].x
        urano.position.z = orbitaUrano.orbitPoints[movimientoUrano].z
        neptuno.position.x = orbitaNeptuno.orbitPoints[movimientoNeptuno].x
        neptuno.position.z = orbitaNeptuno.orbitPoints[movimientoNeptuno].z

        
        movimientoMercurio = (movimientoMercurio + 1) % (orbitaMercurio.orbitPoints.length - 1) 
        movimientoVenus = (movimientoVenus + 1) % (orbitaVenus.orbitPoints.length - 1)
        movimientoTierra = (movimientoTierra + 1) % (orbitaTierra.orbitPoints.length - 1)
        movimientoLuna = (movimientoLuna + 1) % (orbitaLuna.orbitPoints.length - 1)
        movimientoMarte = (movimientoMarte + 1) % (orbitaMarte.orbitPoints.length - 1)
        movimientoJupiter = (movimientoJupiter + 1) % (orbitaJupiter.orbitPoints.length - 1)
        movimientoSaturno = (movimientoSaturno + 1) % (orbitaSaturno.orbitPoints.length - 1)
        movimientoUrano = (movimientoUrano + 1) % (orbitaUrano.orbitPoints.length - 1)
        movimientoNeptuno = (movimientoNeptuno + 1) % (orbitaNeptuno.orbitPoints.length - 1)
    });
    
  
    

    xrExperience.baseExperience.sessionManager.onXRSessionInit.add((xrSession) => {
      console.log("En XRSessionInit")
      xrCamera.setTransformationFromNonVRCamera(camera);

      xrExperience.input.xrCamera.position = camera.position;

      ARenabled = true;

      console.log("Camara xr en XRSessionInit", xrCamera)

      console.log("Camara normal en XRSession: ", camera)

      console.log("xrCamera.camera position ", xrExperience.input.xrCamera.position);
    

    });
   // --------------------- COLOR PICKER --------------------- 
  scene.onPointerObservable.add((pointerInfo) => {
  if(pointerInfo.type == BABYLON.PointerEventTypes.POINTERDOWN){
      if(UIshown == "startScreen"){
        //XR_experienceReturns = XR_Module.XR_Experience(playground.ground, skybox, camera, scene);
        // Create a WebXR session manager
        // Create a WebXR camera

        
        console.log("En Observable",xrCamera)
        console.log("Posicion camara XR ", xrExperience.input.xrCamera.position)
        xrExperience.input.xrCamera.position = camera.position;
        console.log("Posicion camara XR igualada a camara ", xrExperience.input.xrCamera.position)	
        xrExperience.input.xrCamera.cameraDirection = camera.cameraDirection;
        xrExperience.input.xrCamera.attachControl(canvas, true);
        console.log("Camara XR igualada a camara ", xrCamera)      


        UIshown = "main";
        //dialogOn = false;
        started = true;
        console.log("System ready")
      }
      if(fuel <= 0 && UIshown == "textBox"){
        fuel = 0;
        console.log("Fuel empty, showing questions")
        showingQuestionFuel = true;
        console.log("Showing question: " + showingQuestionFuel)
      }
      if(partOneAnswered && UIshown == "textBox"){
        UIshown = "main";
      }
  }
}); 

  
   
   colorPicker.onValueChangedObservable.add((value) => {
      console.log("Color: " + value.toHexString());
      color = value.toHexString();
      orbitaMercurio.color = new BABYLON.Color3.FromHexString(color);
      orbitaVenus.color = new BABYLON.Color3.FromHexString(color);
      orbitaTierra.color = new BABYLON.Color3.FromHexString(color);
      orbitaLuna.color = new BABYLON.Color3.FromHexString(color);
      orbitaMarte.color = new BABYLON.Color3.FromHexString(color);
      orbitaJupiter.color = new BABYLON.Color3.FromHexString(color);
      orbitaSaturno.color = new BABYLON.Color3.FromHexString(color);
      orbitaUrano.color = new BABYLON.Color3.FromHexString(color);
      orbitaNeptuno.color = new BABYLON.Color3.FromHexString(color);
    });
    
    botonYes.onPointerClickObservable.add(() => {
      if(UIshown == "textBox" && nearPlanet !== null && nearPlanet !== undefined){
        camera.position.x = nearPlanet.position.x + 10;
        camera.position.y = nearPlanet.position.y + 10;
        camera.position.z = nearPlanet.position.z + 10;
        camera.setTarget(nearPlanet.position);
        UIshown = "planetInfo";
        planet = nearPlanet;
        UI.hideUI(confirmButtonsUIElements);
        switch (nearPlanet) {
          case mercurio:
            planetInfo.source = "https://i.imgur.com/l85D4oE.png"
            break;
          case venus:
            planetInfo.source = "https://i.imgur.com/Fz1YmOe.png"
            break;
          case tierra:
            planetInfo.source = "https://i.imgur.com/qEpz91f.png"
            break;
          case marte:
            planetInfo.source = "https://i.imgur.com/Nphj8GI.png"
            break;
          case jupiter:
            planetInfo.source = "https://i.imgur.com/KX8rAre.png"
            break;
          case saturno:
            planetInfo.source = "https://i.imgur.com/yxB9HH5.png"
            break;
          case urano:
            planetInfo.source = "https://i.imgur.com/1Oxnj4D.png"
            break;
          case neptuno:
            planetInfo.source = "https://i.imgur.com/Wwr2CvT.png"
            break;
          default:
            break;
        }
      
      //planetInfo.isVisible = true;
      if(!visitedPlanets.includes(planet)){
        visitedPlanets.push(planet);
      }
      console.log(visitedPlanets)
      showingPlanetAnchor = true;
    }

      if(testOneAvailable && nearPlanet == null){
        console.log("Test one available")
        //dialogOn = false;
        showingQuestionPartOne = true;
      }

    });

    botonNo.onPointerClickObservable.add(() => {
      UIshown = "main";

      if(testOneAvailable){
        neededKmToTest = neededKmToTest + 100;
      }
      showingPlanetAnchor = false;
    });

    botonConfig.onPointerClickObservable.add(() => {
      console.log("Configurar");
      UIshown = "config";
    });

    botonClose.onPointerClickObservable.add(() => {
      console.log("Cerrar");
      UIshown = "main";
    });

    sliderSize.onValueChangedObservable.add((value) => {
      console.log("Valor: " + value);
      TextblockSize.text = value + " m.";
    });

    botonOrbitas.onIsCheckedChangedObservable.add((value) => {
      if(value == false){
        console.log("Orbits shown")
        UI.showUI(orbits);
      }
      else{
        console.log("Orbits hidden")
        UI.hideUI(orbits);
      }
    });

    buttonBack.onPointerClickObservable.add(() => {
      console.log("Back");
      UIshown = "main";
      planet = null;
    });

    botonOp1.onPointerClickObservable.add(() => {
      console.log("Op1");
      if (question.correct == 0) {
        console.log("Correct")
        fuel += 10;
        if(showingQuestionPartOne){
        correctAnswers += 1;
        }
        questionShown = false;
      } else {
        console.log("Incorrect");
        questionShown = false;
        incorrectAnswers += 1;
        console.log(incorrectAnswers)
      }
    });

    botonOp2.onPointerClickObservable.add(() => {
      console.log("Op2");
      if (question.correct == 1) {
        console.log("Correct")
        fuel += 10;
        if(showingQuestionPartOne){
        correctAnswers += 1;
        }
        questionShown = false;
      } else {
        console.log("Incorrect");
        questionShown = false;
        incorrectAnswers += 1;
        console.log(incorrectAnswers)
      }
    });

    botonOp3.onPointerClickObservable.add(() => {
      console.log("Op3");
      if (question.correct == 2) {
        console.log("Correct")
        fuel += 10;
        if(showingQuestionPartOne){
        correctAnswers += 1;
        }
       questionShown = false;
      } else {
        console.log("Incorrect");
        questionShown = false;
        incorrectAnswers += 1;
        console.log(incorrectAnswers)
      }
    });


    botonOp4.onPointerClickObservable.add(() => {
      console.log("Op4");
      if (question.correct == 3) {
        console.log("Correct")
        fuel += 10;
        if(showingQuestionPartOne){
        correctAnswers += 1;
        }
        questionShown = false;
      } else {
        console.log("Incorrect");
        questionShown = false;
        incorrectAnswers += 1;
        console.log(incorrectAnswers)
      }
    });

    sliderFigura.onValueChangedObservable.add((value) => {
      console.log("Valor: " + value);
      if(value > 0.9)
      {
        firstSceneContainer.addAllToScene();
        secondSceneContainer.removeAllFromScene();
        
      } else {
        firstSceneContainer.removeAllFromScene();
        secondSceneContainer.addAllToScene();
      }
    });

    scene.onBeforeRenderObservable.add(() => {
        if(enfoque != null){
          camera.setTarget(enfoque.position);
        }
    }); 

    scene.onKeyboardObservable.add((kbInfo) => {
      if (kbInfo.type === BABYLON.KeyboardEventTypes.KEYDOWN) {
        if(kbInfo.event.key === " "){
          if(fuel>0){
            moving = true;
            accelerator.children[0].isVisible = false;
            accelerator.children[1].isVisible = true;
            //var direction = camera.getDirection(BABYLON.Axis.Z);
            //camera.position.addInPlace(direction.scale(1*acceleration));
            //movedKM += 1;
            //console.log(movedKM)
            }
          }
        }
      if (kbInfo.type === BABYLON.KeyboardEventTypes.KEYUP){
        if(kbInfo.event.key === " "){
          console.log("Stopped");
          moving = false;
          accelerator.children[0].isVisible = true;
          accelerator.children[1].isVisible = false;
          //var direction = camera.getDirection(BABYLON.Axis.Z);
          //camera.position.addInPlace(direction.scale(1*acceleration));
          //movedKM += 1;
          //console.log(movedKM)
        }
      }
      });

        botonAcelerar.onPointerDownObservable.add((pointerInfo) => {
          xrExperience.input.xrCamera.position = camera.position; 
        if(fuel>0){
          console.log(xrCamera.position)
          xrCamera.position.addInPlace(xrCamera.getDirection(BABYLON.Axis.Z).scale(1*acceleration));
          console.log(xrCamera.position)
          moving = true;
          accelerator.children[0].isVisible = false;
          accelerator.children[1].isVisible = true;
          }
        });

        
        botonAcelerar.onPointerUpObservable.add((pointerInfo) => {
          moving = false;
          accelerator.children[0].isVisible = true;
          accelerator.children[1].isVisible = false;
          });

/*
     //const XR_experienceReturns = XR_Module.XR_Experience(playground.ground, skybox, camera, scene);
     if(XR_experienceReturns != null){
      
      // Create a WebXR session manager
      const xrSessionManager = XR_experienceReturns[1];

      // Create a WebXR camera

      const xrCamera = XR_experienceReturns[2];
      console.log(xrCamera)

      ARenabled = XR_experienceReturns[3];
      console.log(ARenabled)
     }
     */
}



function Tema() {
    return (
      <React.Fragment>
  
      <SceneComponent antialias onSceneReady={onSceneReady} id="SceneCanvas" />
  
      </React.Fragment>
    );
  }
  
  export default Tema;