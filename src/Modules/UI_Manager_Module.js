import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';

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