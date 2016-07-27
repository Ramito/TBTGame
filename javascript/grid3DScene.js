var THREE = require('three');

var Grid3DScene = {
    renderGrid: function(grid, cubeSize, heightFactor, scene) {
        var cubeGeometry = new THREE.CubeGeometry(cubeSize, heightFactor, cubeSize);
        var cubeMaterial = new THREE.MeshLambertMaterial({
            color: 0x1ec876
        });

        var heightPropertyName = "height";
        var gridHasHeight = grid.hasGridProperty(heightPropertyName);

        var max = grid.columns * grid.rows;
        for (var cell = 0; cell < max; ++cell) {
            var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
            cube.position.x = grid.getCellX(cell) * cubeSize;
            cube.position.y = 0;
            cube.position.z = grid.getCellY(cell) * cubeSize;
            scene.add(cube);
            if (gridHasHeight) {
                for (var height = 1; height <= grid.getGridPropertyValue(heightPropertyName, cell); ++height) {
                    cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    cube.position.x = grid.getCellX(cell) * cubeSize;
                    cube.position.y = height * heightFactor;
                    cube.position.z = grid.getCellY(cell) * cubeSize;
                    scene.add(cube);
                }
            }
        }
    },

    setGridScenePosition: function(cell, inGrid, positionToSet, squareSize, squareHeight) {
        positionToSet.x = inGrid.getCellX(cell) * squareSize;
        positionToSet.y = squareHeight * 0.5;
        positionToSet.z = inGrid.getCellY(cell) * squareSize;
        if (inGrid.hasGridProperty('height')) {
            positionToSet.y += squareHeight * inGrid.getGridPropertyValue('height', cell);
        }
    }
};

module.exports = Grid3DScene;