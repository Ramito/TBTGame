var Grid = {
    makeGrid: function(columns, rows) {
        var grid = {};
        grid.columns = columns;
        grid.rows = rows;

        grid.getCell = function(i, j) {
            return j * grid.columns + i % grid.rows;
        };
        grid.getCellX = function(cell) {
            return cell % grid.columns;
        };
        grid.getCellY = function(cell) {
            return Math.floor(cell / grid.columns);
        };

        ///Grid properties
        function makeGridProperty(propertyName, defaultValue) {
            var propertyObject = {};

            var totalLength = columns * rows;
            var values = new Array(totalLength);
            for (var i = 0; i < totalLength; ++i) {
                values[i] = defaultValue;
            }

            propertyObject.values = values;

            propertyObject.getValue = function(cell) {
                return propertyObject.values[cell];
            };

            propertyObject.setValue = function(cell, value) {
                propertyObject.values[cell] = value;
            };

            return propertyObject;
        }

        var gridProperties = {};
        grid.gridProperties = gridProperties;

        grid.addGridProperty = function(propertyName, defaultValue = 0) {
            if (!(propertyName in gridProperties)) {
                gridProperties[propertyName] = makeGridProperty(propertyName, defaultValue);
            } else {
                console.assert(false, "Adding an already existing property name to grid: " + propertyName);
            }
        };

        grid.getGridProperty = function(propertyName) {
            return gridProperties[propertyName];
        };

        grid.getGridPropertyValue = function(propertyName, cell) {
            return gridProperties[propertyName].getValue(cell);
        };

        grid.setGridPropertyValue = function(propertyName, cell, value) {
            gridProperties[propertyName].setValue(cell, value);
        };

        grid.hasGridProperty = function(propertyName) {
            return propertyName in gridProperties;
        };

        return grid;
    }
};

module.exports = Grid;