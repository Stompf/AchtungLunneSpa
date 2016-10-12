define(["require", "exports"], function (require, exports) {
    "use strict";
    var KeyboardStates = (function () {
        function KeyboardStates(keyboardGroup) {
            this.setKeyboard(keyboardGroup);
        }
        KeyboardStates.prototype.keyDown = function (keycode) {
            return this.handleKeycodes(keycode, true);
        };
        KeyboardStates.prototype.keyUp = function (keycode) {
            return this.handleKeycodes(keycode, false);
        };
        KeyboardStates.prototype.resetAll = function () {
            this.isUpKeyDown = false;
            this.isDownKeyDown = false;
            this.isLeftKeyDown = false;
            this.isRightKeyDown = false;
        };
        KeyboardStates.prototype.setKeyboard = function (keyboardGroup) {
            switch (keyboardGroup) {
                case 1 /* Arrows */:
                    this.upKeycode = KeyboardStates.ArrowUp;
                    this.downKeycode = KeyboardStates.ArrowDown;
                    this.leftKeycode = KeyboardStates.ArrowLeft;
                    this.rightKeycode = KeyboardStates.ArrowRight;
                    break;
                case 0 /* WSAD */:
                    this.upKeycode = KeyboardStates.W;
                    this.downKeycode = KeyboardStates.S;
                    this.leftKeycode = KeyboardStates.A;
                    this.rightKeycode = KeyboardStates.D;
                    break;
                default:
                    console.error("Keyboardgroup: " + keyboardGroup + " not found!");
            }
        };
        KeyboardStates.prototype.handleKeycodes = function (keycode, isDown) {
            switch (keycode) {
                case this.upKeycode:
                    this.isUpKeyDown = isDown;
                    return true;
                case this.downKeycode:
                    this.isDownKeyDown = isDown;
                    return true;
                case this.leftKeycode:
                    this.isLeftKeyDown = isDown;
                    return true;
                case this.rightKeycode:
                    this.isRightKeyDown = isDown;
                    return true;
                default:
                    return false;
            }
        };
        KeyboardStates.W = 87;
        KeyboardStates.S = 83;
        KeyboardStates.A = 65;
        KeyboardStates.D = 68;
        KeyboardStates.ArrowUp = 38;
        KeyboardStates.ArrowDown = 40;
        KeyboardStates.ArrowLeft = 37;
        KeyboardStates.ArrowRight = 39;
        return KeyboardStates;
    }());
    return KeyboardStates;
});
//# sourceMappingURL=KeyboardStates.js.map