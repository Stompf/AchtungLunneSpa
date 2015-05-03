import BoundingBox = require("./BoundingBox");
import ClientPlayer = require("./ClientPlayer");
import utils = require('../common/Utils');
import ko = require('knockout');
import collections = require('../collections');

class ClientMap {
    mapSize: SPATest.ServerCode.Size;
    mapParts: collections.Dictionary<string, SPATest.ServerCode.MapPart>;
    playerSize: number;
    startPositionPadding: number;

    constructor(serverMap: SPATest.ServerCode.Map) {
        this.mapSize = serverMap.mapSize;
        this.playerSize = serverMap.playerSize;
        this.startPositionPadding = serverMap.startPositionPadding;
        this.mapParts = new collections.Dictionary<string, SPATest.ServerCode.MapPart>();

		this.resetMapParts();
    }

    resetMapParts() {
        this.mapParts.clear();
	}

    render(ctx: CanvasRenderingContext2D, deltaTick: number) {
		if (this.mapParts == null) {
			return;
		}

        this.mapParts.values().forEach(mapPart => {
            if (mapPart.color && mapPart.color != '#FFFFFF') {
                ctx.fillStyle = mapPart.color;
                ctx.fillRect(mapPart.x, mapPart.y, this.playerSize, this.playerSize);
            }	
        });
    }

    isValidPosition(position: SPATest.ServerCode.Vector2D, objectSize: SPATest.ServerCode.Size) {
        return this.isInBounds(position, objectSize);
    }

	getRandomStartPosition() {
		var randX = utils.getRandomInt(this.startPositionPadding, this.mapSize.width - this.startPositionPadding);
		var randY = utils.getRandomInt(this.startPositionPadding, this.mapSize.height - this.startPositionPadding);
		return <SPATest.ServerCode.Vector2D> {
			x: randX,
			y: randY
		};
	}

	toMapPartKey(X: number, Y: number) {
		return X + '_' + Y;
    }

    addMapPart(player: SPATest.ServerCode.Player) {
        var key = this.toMapPartKey(player.position.x, player.position.y);
        this.mapParts.setValue(key, <SPATest.ServerCode.MapPart> {
            color: player.color,
            owner: player.connectionId,
            x: player.position.x,
            y: player.position.y
        });
    }

    private isInBounds(position: SPATest.ServerCode.Vector2D, objectSize: SPATest.ServerCode.Size) {
        return position.x >= 0 &&
            position.x <= (this.mapSize.width - objectSize.width) &&
            position.y >= 0 && position.y <= (this.mapSize.height - objectSize.height) ;
    }
}
export = ClientMap;