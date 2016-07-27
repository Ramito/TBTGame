var THREE = require('three');
var Grid = require('./grid');
var Grid3DScene = require('./grid3DScene');
var Selectables = require('./selectables');

//renderer
var width = window.innerWidth;
var height = window.innerHeight;
var renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

//camera
var camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000);
camera.position.x = 0;
camera.position.y = 250;
camera.position.z = 0;
camera.lookAt(new THREE.Vector3(500, 0, 500));

//scene
var scene = new THREE.Scene();
scene.add(camera);

//var clock = new THREE.Clock;

var skyboxGeometry = new THREE.CubeGeometry(10000, 10000, 10000);
var skyboxMaterial = new THREE.MeshBasicMaterial({
    color: 0x111111,
    side: THREE.BackSide
});
var skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
scene.add(skybox);

var pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(0, 300, 200);
scene.add(pointLight);

pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(600, 300, 600);
scene.add(pointLight);

var grid = Grid.makeGrid(20, 16);

var heightPropertyName = 'height';
grid.addGridProperty(heightPropertyName);
grid.setGridPropertyValue(heightPropertyName, grid.getCell(7, 3), 4);

Grid3DScene.renderGrid(grid, 50, 30, scene);

function render() {
    trace();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

function makeGameEntityFactory() {
    var id = 0;
    var factory = {
        makeGameEntity : function () {
            var gameEntity = { id : id };
            ++id;
            return gameEntity;
        }
    };
    return factory;
}

var entityFactory = makeGameEntityFactory();
var gameEntityCollection = [];

for (var i = 0; i < 5; ++i){
    gameEntityCollection[i] = entityFactory.makeGameEntity();
}


var singleSelectionManager = Selectables.makeSingleSelectionHandler();
for (var i = 0; i < 5; ++i){
    gameEntityCollection[i].selectionShape = singleSelectionManager.makeAndRegisterSelectableCylinder(20,60, gameEntityCollection[i]);
}

Grid3DScene.setGridScenePosition(grid.getCell(5,5), grid, gameEntityCollection[0].selectionShape.position, 50, 30);
Grid3DScene.setGridScenePosition(grid.getCell(7,5), grid, gameEntityCollection[1].selectionShape.position, 50, 30);

singleSelectionManager.onSelect(onSelect);

function onSelect(event, selectedObject) {
    console.log("HI " + selectedObject.id);
}

for (var i = 0; i < 5; ++i){
    scene.add(gameEntityCollection[i].selectionShape);
}

function trace() {
    singleSelectionManager.tick(camera);
}

render();