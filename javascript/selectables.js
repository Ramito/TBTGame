var THREE = require('three');
var EventEmitter = require('events');

var Selectables = {
    makeSingleSelectionHandler: function() {
        var singleSelectionManager = {};

        var registeredSelectables = [];

        var selectionEventEmitter = new EventEmitter.EventEmitter();

        singleSelectionManager.makeAndRegisterSelectableCylinder = function(radius, height, eventPayload) {
            var cylinderGeometry = new THREE.CylinderGeometry(radius, radius, height);
            var cylinderMaterial = new THREE.MeshLambertMaterial({
                color: 0xee0808
            });
            var cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);

            singleSelectionManager.registerSelectable(cylinder, eventPayload);

            return cylinder;
        };

        singleSelectionManager.registerSelectable = function(newSelectableShape, eventPayload) {
            newSelectableShape.isSelected = function() {
                return (newSelectableShape === currentSelected);
            };

            newSelectableShape.hoverEnter = function() {
                selectionEventEmitter.emit('hoverenter', newSelectableShape, eventPayload);
            };

            newSelectableShape.hoverExit = function() {
                selectionEventEmitter.emit('hoverexit', newSelectableShape, eventPayload);
            };

            newSelectableShape.click = function() {
                selectionEventEmitter.emit('click', newSelectableShape, eventPayload);
            };

            newSelectableShape.select = function() {
                selectionEventEmitter.emit('select', newSelectableShape, eventPayload);
            };

            newSelectableShape.deselect = function() {
                selectionEventEmitter.emit('deselect', newSelectableShape, eventPayload);
            };

            registeredSelectables.push(newSelectableShape);
        };

        singleSelectionManager.clearAllSelectables = function() {
            registeredSelectables = [];
        };

        singleSelectionManager.removeSelectable = function(selectable) {
            var index = registeredSelectables.indexOf(selectable);
            if (index > -1) {
                registeredSelectables.splice(index, 1);
            }
            return index > -1;
        };

        var currentHovered = null;
        var currentMouseDown = null;
        var currentSelected = null;

        var mousePosition = {
            x: 0,
            y: 0
        };

        function onMouseMove(event) {
            mousePosition.x = (event.x / window.innerWidth) * 2 - 1;
            mousePosition.y = -(event.y / window.innerHeight) * 2 + 1;
        }

        var raycaster = new THREE.Raycaster();
        singleSelectionManager.tick = function(camera) {
            raycaster.setFromCamera(mousePosition, camera);
            var results = raycaster.intersectObjects(registeredSelectables);
            if (results.length > 0) {
                var rayCasted = results[0].object;
                if (currentHovered !== rayCasted) {
                    if (currentHovered !== null) {
                        currentHovered.hoverExit();
                    }
                    currentHovered = rayCasted;
                    currentHovered.hoverEnter();
                }
            } else if (currentHovered !== null) {
                currentHovered.hoverExit();
                currentHovered = null;
            }
        };

        function leftMouseEvent(event) {
            return event.button === 0;
        }

        function onMouseDown(event) {
            if (leftMouseEvent(event)) {
                currentMouseDown = currentHovered;
            }
        }

        function onMouseUp(event) {
            if (leftMouseEvent(event)) {
                if ((currentSelected !== currentMouseDown) && (currentSelected !== currentHovered)) {
                    if (currentSelected !== null) {
                        currentSelected.deselect();
                        currentSelected = null;
                    }
                }
                if (currentMouseDown !== null) {
                    if (currentMouseDown === currentHovered) {
                        currentHovered.click();
                        if (currentSelected !== currentMouseDown) {
                            currentSelected = currentMouseDown;
                            currentSelected.select();
                        }
                    }
                }
                currentMouseDown = null;
            }
        }

        singleSelectionManager.onHoverEnter = function(hoverEnterHandler) {
            selectionEventEmitter.addListener('hoverenter', hoverEnterHandler);
        };

        singleSelectionManager.onHoverExit = function(hoverExitHandler) {
            selectionEventEmitter.addListener('hoverexit', hoverExitHandler);
        };

        singleSelectionManager.onClick = function(selectHandler) {
            selectionEventEmitter.addListener('click', selectHandler);
        };

        singleSelectionManager.onSelect = function(selectHandler) {
            selectionEventEmitter.addListener('select', selectHandler);
        };

        singleSelectionManager.onDeselect = function(deselectHandler) {
            selectionEventEmitter.addListener('deselect', deselectHandler);
        };

        singleSelectionManager.removeOnHoverEnter = function(hoverEnterHandler) {
            selectionEventEmitter.removeListener('hoverenter', hoverEnterHandler);
        };

        singleSelectionManager.removeOnHoverExit = function(hoverExitHandler) {
            selectionEventEmitter.removeListener('hoverexit', hoverExitHandler);
        };

        singleSelectionManager.removeOnSelect = function(selectHandler) {
            selectionEventEmitter.removeListener('select', selectHandler);
        };

        singleSelectionManager.removeOnDeselect = function(deselectHandler) {
            selectionEventEmitter.removeListener('deselect', deselectHandler);
        };

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mousedown", onMouseDown);
        window.addEventListener("mouseup", onMouseUp);

        return singleSelectionManager;
    }
};

module.exports = Selectables;