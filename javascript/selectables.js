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

            cylinder.isSelected = function() {
                return (cylinder === currentSelected);
            };

            cylinder.hoverEnter = function() {
                if (!cylinder.isSelected()) {
                    cylinder.material.color.set(0x0000ff);
                }
                selectionEventEmitter.emit('hoverenter', cylinder, eventPayload);
            };

            cylinder.hoverExit = function() {
                if (!cylinder.isSelected()) {
                    cylinder.material.color.set(0xee0808);
                }
                selectionEventEmitter.emit('hoverexit', cylinder, eventPayload);
            };

            cylinder.select = function() {
                cylinder.material.color.set(0xffffff);
                selectionEventEmitter.emit('select', cylinder, eventPayload);
            };

            cylinder.deselect = function() {
                cylinder.material.color.set(0xee0808);
                selectionEventEmitter.emit('deselect', cylinder, eventPayload);
            };

            registeredSelectables.push(cylinder);

            return cylinder;
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
                    if ((currentMouseDown === currentHovered) && (currentSelected !== currentMouseDown)) {
                        currentSelected = currentMouseDown;
                        currentSelected.select();
                    }
                }
                currentMouseDown = null;
            }
        }
        
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mousedown", onMouseDown);
        window.addEventListener("mouseup", onMouseUp);

        return singleSelectionManager;
    }
};

module.exports = Selectables;
