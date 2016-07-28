var THREE = require('three');

var Grid3DScene = {
    create: function(grid, gridSize, heightFactor) {
        var scene = {};

        scene.render = function(renderScene) {
            var cubeGeometry = new THREE.CubeGeometry(gridSize, heightFactor, gridSize);
            var cubeMaterial = new THREE.MeshLambertMaterial({
                color: 0x1ec876
            });

            var heightPropertyName = "height";
            var gridHasHeight = grid.hasGridProperty(heightPropertyName);

            var max = grid.columns * grid.rows;
            for (var cell = 0; cell < max; ++cell) {
                var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
                cube.position.x = grid.getCellX(cell) * gridSize;
                cube.position.y = 0;
                cube.position.z = grid.getCellY(cell) * gridSize;
                renderScene.add(cube);
                if (gridHasHeight) {
                    for (var height = 1; height <= grid.getGridPropertyValue(heightPropertyName, cell); ++height) {
                        cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
                        cube.position.x = grid.getCellX(cell) * gridSize;
                        cube.position.y = height * heightFactor;
                        cube.position.z = grid.getCellY(cell) * gridSize;
                        renderScene.add(cube);
                    }
                }
            }
        };

        scene.getPositionInScene = function(cell) {
            var position = {
                x: 0,
                y: 0,
                z: 0
            };
            position.x = grid.getCellX(cell) * gridSize;
            position.y = heightFactor * 0.5;
            position.z = grid.getCellY(cell) * gridSize;
            if (grid.hasGridProperty('height')) {
                position.y += heightFactor * grid.getGridPropertyValue('height', cell);
            }
            return position;
        };

        scene.setPositionInScene = function(cell, positionToSet, heightOffset) {
            var scenePosition = scene.getPositionInScene(cell);
            positionToSet.x = scenePosition.x;
            positionToSet.y = scenePosition.y + heightOffset;
            positionToSet.z = scenePosition.z;
        };

        return scene;
    },
};

module.exports = Grid3DScene;