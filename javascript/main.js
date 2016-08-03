var THREE = require('three');
var Grid = require('./grid');
var Grid3DScene = require('./grid3DScene');
var Selectables = require('./selectables');
var Random = require("random-js");

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
camera.position.y = 350;
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

function render() {
    trace();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

function makeGameEntityFactory() {
    var id = 0;
    var factory = {
        makeGameEntity: function() {
            var gameEntity = {
                id: id,
                cellPosition: -1
            };
            ++id;
            return gameEntity;
        }
    };
    return factory;
}

var entityFactory = makeGameEntityFactory();
var gameEntityCollection = [];

var gameEntities = 20;
var random = new Random(Random.engines.mt19937().autoSeed());

for (var i = 0; i < gameEntities; ++i) {
    var gameEntity = entityFactory.makeGameEntity();
    var randomCell = random.integer(0, grid.columns * grid.rows); //TODO: Check for existing ocupancy!
    gameEntity.cellPosition = randomCell;
    gameEntityCollection[i] = gameEntity;

}


var singleSelectionManager = Selectables.makeSingleSelectionHandler();
for (var i = 0; i < gameEntities; ++i) {
    gameEntityCollection[i].selectionShape = singleSelectionManager.makeAndRegisterSelectableCylinder(20, 60, gameEntityCollection[i]);
}

var gridScene = Grid3DScene.create(grid, 50, 30);

gridScene.render(scene);

for (var i = 0; i < gameEntities; ++i) {
    var gameEntity = gameEntityCollection[i];
    gridScene.setPositionInScene(gameEntity.cellPosition, gameEntity.selectionShape.position, 30);
}

for (var i = 0; i < gameEntities; ++i) {
    scene.add(gameEntityCollection[i].selectionShape);
}

gridScene.onGridClick(onGridClick);

function onGridClick(event, cellInfo) {
    if ((selectedShape !== null) && (hoveredShape === null)) {
        gridScene.setPositionInScene(cellInfo.cell, selectedShape.selectionShape.position, 30);
        selectedShape = null;
    }
}

var selectedShape = null;

function onSelect(event, selectedObject) {
    selectedShape = selectedObject;

    var selectionShape = selectedObject.selectionShape;
    selectionShape.material.color.set(0xffffff);
}

function onDeselect(event, selectedObject) {
    //selectedShape = null;

    var selectionShape = selectedObject.selectionShape;
    selectionShape.material.color.set(0xee0808);
}

var hoveredShape = null;

function onHover(event, selectedObject) {
    hoveredShape = selectedObject;
    var selectionShape = selectedObject.selectionShape;
    if (!selectionShape.isSelected()) {
        selectionShape.material.color.set(0x0000ff);
    }
}

function onHoverExit(event, selectedObject) {
    hoveredShape = null;
    var selectionShape = selectedObject.selectionShape;
    if (!selectionShape.isSelected()) {
        selectionShape.material.color.set(0xee0808);
    }
}

singleSelectionManager.onSelect(onSelect);
singleSelectionManager.onDeselect(onDeselect);
singleSelectionManager.onHoverEnter(onHover);
singleSelectionManager.onHoverExit(onHoverExit);

function trace() {
    singleSelectionManager.tick(camera);
    if (hoveredShape === null) {
        gridScene.tickGridSelection(camera);
    }
}

render();