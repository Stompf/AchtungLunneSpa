import KeyboardGroup = require("./KeyboardGroup");

class KeyboardStates {

    static W = 87;
    static S = 83;
    static A = 65;
    static D = 68;

    static ArrowUp = 38;
    static ArrowDown = 40;
    static ArrowLeft = 37;
    static ArrowRight = 39;

    private upKeycode: number;
    private downKeycode: number;
    private leftKeycode: number;
    private rightKeycode: number;

    isUpKeyDown: boolean;
    isDownKeyDown: boolean;
    isLeftKeyDown: boolean;
    isRightKeyDown: boolean;

    constructor(keyboardGroup: KeyboardGroup) {
        this.setKeyboard(keyboardGroup);
    }


    keyDown(keycode: number) {
        return this.handleKeycodes(keycode, true);
    }

    keyUp(keycode: number) {
        return this.handleKeycodes(keycode, false);
    }

	resetAll() {
		this.isUpKeyDown = false;
		this.isDownKeyDown = false;
		this.isLeftKeyDown = false;
		this.isRightKeyDown = false;
	}

    private setKeyboard(keyboardGroup: KeyboardGroup) {
        switch (keyboardGroup) {
            case KeyboardGroup.Arrows:
                this.upKeycode = KeyboardStates.ArrowUp;
                this.downKeycode = KeyboardStates.ArrowDown;
                this.leftKeycode = KeyboardStates.ArrowLeft;
                this.rightKeycode = KeyboardStates.ArrowRight;
                break;
            case KeyboardGroup.WSAD:
                this.upKeycode = KeyboardStates.W;
                this.downKeycode = KeyboardStates.S;
                this.leftKeycode = KeyboardStates.A;
                this.rightKeycode = KeyboardStates.D;
                break;
            default:
                console.error("Keyboardgroup: " + keyboardGroup + " not found!");
        }
    }

    private handleKeycodes(keycode: number, isDown: boolean) {
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
    }
}
export = KeyboardStates;