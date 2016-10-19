import KeyboardStates = require("../lunnEngine/KeyboardStates");
import ClientMap = require("./ClientMap");
import Team = require("./Team");
import collection = require('collections');
import BoundingBox = require('../lunnEngine/BoundingBox');
import ko = require('knockout');

class ClientPlayer implements SPATest.ServerCode.Player {

    startSize: SPATest.ServerCode.Size;

    position: SPATest.ServerCode.Vector2D;
    previousPosition: BoundingBox;
    color: string;
    team: SPATest.ServerCode.Team;
    size: SPATest.ServerCode.Size;
    keyboardStates: KeyboardStates;
	connectionId: string;
	movement: number;

    isLocalPlayer: boolean;
    score: KnockoutObservable<number>;
    latestFrameUpdate: number;
    speed: number = 250;
    isAlive: boolean;
    haveCurrentHole: boolean;
    currentHoleEndTime: Date;
    lastPositionVector: SPATest.ServerCode.BoundingBox;

    constructor(serverPlayer: SPATest.ServerCode.Player, keyboardGroup: LunnEngine.KeyboardGroup, isLocalPlayer: boolean) {
        this.position = serverPlayer.position;
        this.lastPositionVector = serverPlayer.lastPositionVector;
        this.team = serverPlayer.team;
        this.score = ko.observable(0);
        this.color = this.setColor(this.team);       
        this.isLocalPlayer = isLocalPlayer;
		this.connectionId = serverPlayer.connectionId;
		serverPlayer.startSize ? this.startSize = serverPlayer.startSize : this.startSize = <SPATest.ServerCode.Size> { height: 10, width: 10 };
        this.size = this.startSize;
        this.latestFrameUpdate = 0;
        this.movement = 0;
        this.isAlive = true;
        this.haveCurrentHole = false;
        this.currentHoleEndTime = new Date();
		if (keyboardGroup != null && isLocalPlayer) {
			this.keyboardStates = new KeyboardStates(keyboardGroup);
		}       
    }

    draw(ctx: CanvasRenderingContext2D, deltaTick: number) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);
    }

    update(ctx: CanvasRenderingContext2D, map: ClientMap, tickLenght: number) {
        this.previousPosition = new BoundingBox(this.position, {
            x: this.position.x + this.size.width,
            y: this.position.y + this.size.height
        });
        let newPosition = this.position;

        if (this.isLocalPlayer && this.isAlive) {
			if (this.keyboardStates.isRightKeyDown) {
				this.movement += 0.3;
			}

			if (this.keyboardStates.isLeftKeyDown) {
				this.movement -= 0.3;
			}

            const speed = this.speed / tickLenght;
			const newPos = <SPATest.ServerCode.Vector2D> {
				x: Math.round(Math.cos(this.movement) * speed + newPosition.x),
				y: Math.round(Math.sin(this.movement) * speed + newPosition.y)
			};
			newPosition = newPos;
        }
        this.position = newPosition;
    }

    victoryMessage() {
        return Team.toString(this.team) + " won!";
    }

    reset() {
        this.isAlive = true;
        this.haveCurrentHole = false;
        this.keyboardStates.resetAll();
    }

    get Name() {
        return this.connectionId + ' (<span style="color: ' + this.color +  '">' + this.color + '</span>)';
    }

    private setColor(team: SPATest.ServerCode.Team) {
        switch (team) {
            case SPATest.ServerCode.Team.RED:
                return "red";
            case SPATest.ServerCode.Team.BLUE:
                return "blue";
            default:
                alert("Could not find team: " + team);
        }
    }

}
export = ClientPlayer;