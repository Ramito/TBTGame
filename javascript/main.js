var THREE = require('three');
var Grid = require('./grid');
var Grid3DScene = require('./grid3DScene');
var GridSelectables = require('./gridSelectables');

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
camera.position.y = 100;
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

var singleSelectionManager = GridSelectables.makeSingleSelectionHandler(grid, 50, 20, 60);
scene.add(singleSelectionManager.makeSelectable(1, 1));
scene.add(singleSelectionManager.makeSelectable(1, 12));
scene.add(singleSelectionManager.makeSelectable(4, 7));
scene.add(singleSelectionManager.makeSelectable(7, 2));
scene.add(singleSelectionManager.makeSelectable(2, 8));

function trace() {
    singleSelectionManager.tick(camera);
}


var mouse = new THREE.Vector2();

function onMouseMove(event) {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}
window.addEventListener('mousemove', onMouseMove, false);

render();