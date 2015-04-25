import BoundingBox = require("./BoundingBox");
import ClientPlayer = require("./ClientPlayer");
import utils = require('../common/Utils');

class Map {

    size: GameEntites.Size;

    zoneWidth: number = 10;
    startPositionPadding: number = 30;

    constructor(size: GameEntites.Size) {
        this.size = size;
    }

    render(ctx: CanvasRenderingContext2D, deltaTick: number) {
        
    }

    isValidPosition(position: GameEntites.Vector2D, objectSize: GameEntites.Size) {
        return this.isInBounds(position, objectSize);
    }

	getRandomStartPosition() {
		var randX = utils.getRandomInt(5, this.size.width - 5);
		var randY = utils.getRandomInt(5, this.size.height - 5);
		return <GameEntites.Vector2D> {
			x: randX,
			y: randY
		};
	}

    private isInBounds(position: GameEntites.Vector2D, objectSize: GameEntites.Size) {
        return position.x >= 0 &&
            position.x <= (this.size.width - objectSize.width) &&
            position.y >= 0 && position.y <= (this.size.height - objectSize.height) ;
    }
}
export = Map;