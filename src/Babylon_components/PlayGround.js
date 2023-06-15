import * as BABYLON from 'babylonjs'
import * as MATERIALS from 'babylonjs-materials'

/**
 * Creates a default playground with collisions
 * @param {Number} playground_width the width of the playground (x axis dimension)
 * @param {Number} playground_depth the depth of the playground (z axis dimension)
 * @param {Number} walls_width the thickness of the walls
 * @param {Number} walls_height the height of the walls
 * @param {BABYLON.Scene} scene 
 * @returns the generated playground
 */
export function PlayGround({playground_width=50,playground_depth=50,walls_width=5,walls_height=10}={},scene) {

    var ground =  BABYLON.MeshBuilder.CreateGround("ground", { width: playground_width, height: playground_depth, subdivisionsX: 50, subdivisionsY: 50 },scene)

    var ceiling = BABYLON.MeshBuilder.CreateGround("ceiling", { width: playground_width, height: playground_depth, subdivisionsX: 50, subdivisionsY: 50 },scene)
    ceiling.position.y = walls_height;

    var wallF =  BABYLON.MeshBuilder.CreateBox("wallF", { width: playground_width, height: walls_height, depth: walls_width },scene)
    wallF.position.set(0, walls_height/2, playground_depth/2+walls_width/2)

    var wallB =  BABYLON.MeshBuilder.CreateBox("wallB", { width: playground_width, height: walls_height, depth: walls_width },scene)
    wallB.position.set(0, walls_height/2, -playground_depth/2-walls_width/2)

    var wallL = BABYLON.MeshBuilder.CreateBox("wallL", { width: walls_width, height: walls_height, depth: playground_depth },scene)
    wallL.position.set(-playground_width/2-walls_width/2, walls_height/2, 0)

    var wallR = BABYLON.MeshBuilder.CreateBox("wallR", { width: walls_width, height: walls_height, depth: playground_depth },scene)
    wallR.position.set(playground_width/2+walls_width/2, walls_height/2 ,0)

    wallF.visibility=0;
    wallB.visibility=0;
    wallL.visibility=0;
    wallR.visibility=0;
    ground.visibility=0;

    ground.checkCollisions=true;
    wallF.checkCollisions=true;
    wallB.checkCollisions=true;
    wallL.checkCollisions=true;
    wallR.checkCollisions=true;

    ground.addChild(wallF);
    ground.addChild(wallB);
    ground.addChild(wallL);
    ground.addChild(wallR);
    ground.addChild(ceiling);

    ground.position = new BABYLON.Vector3(0,-100,0);
    
    var ground_base_color = new BABYLON.StandardMaterial("ground_base_color", scene)
    ground_base_color.diffuseColor =  new BABYLON.Color3(1,1,1);
    ground.material = ground_base_color;
  
  
    var gridground=ground.clone("gridground");
    gridground.position.y= ground.position.y+0.001;
    var grid_ground_material = new MATERIALS.GridMaterial("groundmaterial", scene)
    grid_ground_material.majorUnitFrequency = 5;
    grid_ground_material.minorUnitVisibility = 0.45;
    grid_ground_material.gridRatio = 1;
    grid_ground_material.backFaceCulling = false;
    grid_ground_material.mainColor = new BABYLON.Color3(0, 0, 1);
    grid_ground_material.lineColor = new BABYLON.Color3(1, 0, 0);
    grid_ground_material.opacity = 0;
  
    gridground.material = grid_ground_material;

    return {ground, wallF, wallB, wallL, wallR};

}