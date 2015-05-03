import KeyboardStates = require("./KeyboardStates");
import KeyboardGroup = require("./KeyboardGroup");
import ClientMap = require("./ClientMap");
import Team = require("./Team");
import collection = require('collections');

class ClientPlayer implements SPATest.ServerCode.Player {

    startSize: SPATest.ServerCode.Size;

    position: SPATest.ServerCode.Vector2D;
    color: string;
    team: SPATest.ServerCode.Team;
    size: SPATest.ServerCode.Size;
    keyboardStates: KeyboardStates;
	connectionId: string;
	movement: number;

    isLocalPlayer: boolean;
    latestFrameUpdate: number;
    speed: number = 250;
    isAlive: boolean;

    constructor(serverPlayer: SPATest.ServerCode.Player, keyboardGroup: KeyboardGroup, isLocalPlayer: boolean) {
        this.position = serverPlayer.position;
        this.team = serverPlayer.team;
        this.color = this.setColor(this.team);       
        this.isLocalPlayer = isLocalPlayer;
		this.connectionId = serverPlayer.connectionId;
		serverPlayer.startSize ? this.startSize = serverPlayer.startSize : this.startSize = <SPATest.ServerCode.Size> { height: 10, width: 10 };
        this.size = this.startSize;
        this.latestFrameUpdate = 0;
        this.movement = 0.25;
        this.isAlive = true;

		if (keyboardGroup != null && isLocalPlayer) {
			this.keyboardStates = new KeyboardStates(keyboardGroup);
		}       
    }

    draw(ctx: CanvasRenderingContext2D, deltaTick: number) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);
    }

    update(ctx: CanvasRenderingContext2D, map: ClientMap, tickLenght: number) {
        var newPosition = this.position;

        if (this.isLocalPlayer) {
			if (this.keyboardStates.isRightKeyDown) {
				this.movement += 0.1;
			}

			if (this.keyboardStates.isLeftKeyDown) {
				this.movement -= 0.1;
			}

			var speed = (this.speed / tickLenght);
			var newPos = <SPATest.ServerCode.Vector2D> {
				x: Math.round(Math.cos(this.movement) * speed + newPosition.x),
				y: Math.round(Math.sin(this.movement) * speed + newPosition.y)
			};
			if (map.isValidPosition(newPos, this.size)) {
				newPosition = newPos;
			}
        }
        this.position = newPosition;
    }

    victoryMessage() {
        return Team.toString(this.team) + " won!";
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