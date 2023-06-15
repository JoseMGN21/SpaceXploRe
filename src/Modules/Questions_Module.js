import * as BABYLON from 'babylonjs';
import questionsJSON from '../Resources/questions.json';


/**
 * @param {Array} visitedPlanets The planets visited by the user.
 * @param {BABYLON.GUI.AdvancedDynamicTexture} QuestionsUI The UI to show the questions.
 * @param {BABYLON.Scene} scene The instanced babylon scene.
 * @returns {Array} The question to be shown.
 */
export function showQuestion(visitedPlanets, QuestionsUI, scene) {
    
    let questionText = QuestionsUI.getControlByName("QuestionText");
    let TextblockOp1 = QuestionsUI.getControlByName("TextblockOp1");
    let TextblockOp2 = QuestionsUI.getControlByName("TextblockOp2");
    let TextblockOp3 = QuestionsUI.getControlByName("TextblockOp3");
    let TextblockOp4 = QuestionsUI.getControlByName("TextblockOp4");

    
    const jsonData = require('../Resources/questions.json');
    const min = 0;
    const max = jsonData.questions.length;
    const randomInteger = Math.floor(Math.random() * (max - min) + min);
    var question = jsonData.questions[randomInteger];

    if(checkVisitedPlanets(visitedPlanets)) {
        questionText.text = question.question;
        TextblockOp1.text = question.answers[0];
        TextblockOp2.text = question.answers[1];
        TextblockOp3.text = question.answers[2];
        TextblockOp4.text = question.answers[3];
    }
    return question;
}

function checkVisitedPlanets(visitedPlanets) {
    let visited = 0;
    let firstPlanets = ["Mercury", "Venus", "Earth", "Mars"];
    firstPlanets.forEach(planet => {
        visitedPlanets.forEach(visitedPlanet => {
            if(planet == visitedPlanet) {
                visited += 1;
            }
    }); 
    });
    if(visited >= 0)
        return true;
    else 
        return false;
}


function checkListOfQuestions(shownQuestions, question) {
    let flag = false;
    shownQuestions.forEach(shownQuestion => {
        if(question == shownQuestion) {
            flag = true;
        }
    });
    return flag;
}
