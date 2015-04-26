import KeyboardStates = require("./KeyboardStates");
import KeyboardGroup = require("./KeyboardGroup");
import Map = require("./Map");
import Team = require("./Team");
import collection = require('collections');

class ClientPlayer implements SPATest.ServerCode.Player {

    startSize: GameEntites.Size;

    position: GameEntites.Vector2D;
    color: string;
    team: SPATest.ServerCode.Team;
    size: GameEntites.Size;
    keyboardStates: KeyboardStates;
	connectionId: string;
	movement: number;

    isLocalPlayer: boolean;
    latestFrameUpdate: number;
    speed: number = 250;

    constructor(serverPlayer: SPATest.ServerCode.Player, keyboardGroup: KeyboardGroup, isLocalPlayer: boolean) {
        this.position = serverPlayer.position;
        this.team = serverPlayer.team;
        this.color = this.setColor(this.team);       
        this.isLocalPlayer = isLocalPlayer;
		this.connectionId = serverPlayer.connectionId;
		serverPlayer.startSize ? this.startSize = serverPlayer.startSize : this.startSize = <GameEntites.Size> { height: 10, width: 10 };
        this.size = this.startSize;
        this.latestFrameUpdate = 0;
		this.movement = 0.25;

		if (keyboardGroup != null && isLocalPlayer) {
			this.keyboardStates = new KeyboardStates(keyboardGroup);
		}       
    }

    draw(ctx: CanvasRenderingContext2D, deltaTick: number) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);
    }

    update(ctx: CanvasRenderingContext2D, map: Map, tickLenght: number) {
        var newPosition = this.position;

        if (this.isLocalPlayer) {
			if (this.keyboardStates.isRightKeyDown) {
				this.movement += 0.1;
			}

			if (this.keyboardStates.isLeftKeyDown) {
				this.movement -= 0.1;
			}

			var speed = (this.speed / tickLenght);
			var newPos = <GameEntites.Vector2D> {
				x: Math.round(Math.cos(this.movement) * speed + newPosition.x),
				y: Math.round(Math.sin(this.movement) * speed + newPosition.y)
			};
			if (map.isValidPosition(newPos, this.size)) {
				newPosition = newPos;
			}

			/*
            if (this.keyboardStates.isUpKeyDown) {
                var newPos = <GameEntites.Vector2D> {
                    x: newPosition.x,
                    y: newPosition.y - (this.speed / tickLenght)
                };
                if (map.isValidPosition(newPos, this.size)) {
                    newPosition = newPos;
                }
            }

            if (this.keyboardStates.isDownKeyDown) {
                var newPos = <GameEntites.Vector2D> {
                    x: newPosition.x,
                    y: newPosition.y + (this.speed / tickLenght)
                };
                if (map.isValidPosition(newPos, this.size)) {
                    newPosition = newPos;
                }
            }

            if (this.keyboardStates.isLeftKeyDown) {
                var newPos = <GameEntites.Vector2D> {
                    x: newPosition.x - (this.speed / tickLenght),
                    y: newPosition.y
                };
                if (map.isValidPosition(newPos, this.size)) {
                    newPosition = newPos;
                }
            }

            if (this.keyboardStates.isRightKeyDown) {
                var newPos = <GameEntites.Vector2D> {
                    x: newPosition.x + (this.speed / tickLenght),
                    y: newPosition.y
                };
                if (map.isValidPosition(newPos, this.size)) {
                    newPosition = newPos;
                }
            }*/
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