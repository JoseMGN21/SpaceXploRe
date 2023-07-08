import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';
import uiEjemplo from "../Resources/guiTextureEjemplo.json"
import mainUI from "../Resources/mainScreenGUI2.json"
import configGUI from "../Resources/configGUI.json"
import startScreenGUI from "../Resources/startScreenGUI.json"
import planetInfoGUI from "../Resources/planetInfoGUI.json"
import textBoxGUI from "../Resources/textBoxGUI.json"
import questionsGUI from "../Resources/questionsGUI.json"

/**
 * @param {Array} elements All the UI elements to be shown in the UI, the array contains the control with obtained with the function "advancedTextureConfig.getControlByName".
 */
export async function showUI(elements) {
    elements.forEach((element) => {
        element.isVisible = true;
    });
}

/**
 * @param {Array} elements All the UI elements to be shown in the UI, the array contains the control with obtained with the function "advancedTextureConfig.getControlByName".  
 */
export async function hideUI(elements) {
    elements.forEach((element) => {
        element.isVisible = false;
    });
}

/**
 * @param {Array} elements All the UI elements to be shown in the UI, the array contains the control with obtained with the function "advancedTextureConfig.getControlByName".  
 */
export function createGUI(scene){
    let advancedTextureMain = GUI.AdvancedDynamicTexture.CreateFullscreenUI("mainUI", true, scene);
    let advancedTextureConfig = GUI.AdvancedDynamicTexture.CreateFullscreenUI("configUI", true, scene);
    let advancedTextureStartScreen = GUI.AdvancedDynamicTexture.CreateFullscreenUI("startScreenUI", true, scene);
    let advancedTextureTextBox = GUI.AdvancedDynamicTexture.CreateFullscreenUI("textBoxUI", true, scene);
    let advancedTexturePlanetInfo = GUI.AdvancedDynamicTexture.CreateFullscreenUI("planetInfoUI", true, scene);
    let advancedTextureQuestions = GUI.AdvancedDynamicTexture.CreateFullscreenUI("questionsUI", true, scene);

    return {advancedTextureMain, advancedTextureConfig, advancedTextureStartScreen, advancedTextureTextBox, advancedTexturePlanetInfo, advancedTextureQuestions};
  }

  export async function loadGUI(advancedTextureMain, advancedTextureConfig, advancedTextureStartScreen, advancedTextureTextBox, advancedTexturePlanetInfo, advancedTextureQuestions){
    
    let loadedGUI = await advancedTextureMain.parseSerializedObject(mainUI);
    let loadedGUIConfig = await advancedTextureConfig.parseSerializedObject(configGUI);
    let loadedGUIStartScreen = await advancedTextureStartScreen.parseSerializedObject(startScreenGUI);
    let loadedGUITextBox = await advancedTextureTextBox.parseSerializedObject(textBoxGUI);
    let loadedGUIPlanetInfo = await advancedTexturePlanetInfo.parseSerializedObject(planetInfoGUI);
    let loadedGUIQuestions = await advancedTextureQuestions.parseSerializedObject(questionsGUI);
    
    /*
    let loadedGUI = advancedTextureMain.parseSerializedObject(mainUI);
    let loadedGUIConfig = advancedTextureConfig.parseSerializedObject(configGUI);
    let loadedGUIStartScreen = advancedTextureStartScreen.parseSerializedObject(startScreenGUI);
    let loadedGUITextBox = advancedTextureTextBox.parseSerializedObject(textBoxGUI);
    let loadedGUIPlanetInfo = advancedTexturePlanetInfo.parseSerializedObject(planetInfoGUI);
    let loadedGUIQuestions = advancedTextureQuestions.parseSerializedObject(questionsGUI);
    */
    return {loadedGUI, loadedGUIConfig, loadedGUIStartScreen, loadedGUITextBox, loadedGUIPlanetInfo, loadedGUIQuestions};
  }