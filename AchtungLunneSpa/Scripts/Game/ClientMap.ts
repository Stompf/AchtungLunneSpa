import BoundingBox = require("./BoundingBox");
import ClientPlayer = require("./ClientPlayer");
import utils = require('../common/Utils');
import ko = require('knockout');

class ClientMap {
	map: SPATest.ServerCode.Map;

    constructor(size: SPATest.ServerCode.Size) {
		this.map = <SPATest.ServerCode.Map> {
			mapSize: size,
			mapParts: new Array<System.Collections.Generic.KeyValuePair<string, SPATest.ServerCode.MapPart>>(),
			tick: 0
		};
		this.resetMapParts();
    }

	resetMapParts() {
		this.map.mapParts = new Array<System.Collections.Generic.KeyValuePair<string, SPATest.ServerCode.MapPart>>();
		for (var x = 0; x < this.map.mapSize.width / this.map.playerSize; x++) {
			for (var y = 0; y < this.map.mapSize.height / this.map.playerSize; y++) {
				var mapPart = <SPATest.ServerCode.MapPart> {
					color: '#FFFFFF',
					owner: null,
					x: x,
					y: y
				}; 

				var keyValuePair = <System.Collections.Generic.KeyValuePair<string, SPATest.ServerCode.MapPart>>{
					key: this.toMapPartKey(x, y),
					value: mapPart
				};
				this.map.mapParts.push(keyValuePair);
			}
		}
	}

    render(ctx: CanvasRenderingContext2D, deltaTick: number) {
		if (this.map == null || this.map.mapParts == null) {
			return;
		}

        for (var part in this.map.mapParts) {
            var mapPart = <SPATest.ServerCode.MapPart><any>this.map.mapParts[part];
            if (mapPart.color && mapPart.color != '#FFFFFF') {
                ctx.fillStyle = mapPart.color;
                ctx.fillRect(mapPart.x, mapPart.y, this.map.playerSize, this.map.playerSize);
            }	
		}
    }

    isValidPosition(position: SPATest.ServerCode.Vector2D, objectSize: SPATest.ServerCode.Size) {
        return this.isInBounds(position, objectSize);
    }

	getRandomStartPosition() {
		var randX = utils.getRandomInt(this.map.startPositionPadding, this.map.mapSize.width - this.map.startPositionPadding);
		var randY = utils.getRandomInt(this.map.startPositionPadding, this.map.mapSize.height - this.map.startPositionPadding);
		return <SPATest.ServerCode.Vector2D> {
			x: randX,
			y: randY
		};
	}

	toMapPartKey(X: number, Y: number) {
		return X + '_' + Y;
	}

    private isInBounds(position: SPATest.ServerCode.Vector2D, objectSize: SPATest.ServerCode.Size) {
        return position.x >= 0 &&
            position.x <= (this.map.mapSize.width - objectSize.width) &&
            position.y >= 0 && position.y <= (this.map.mapSize.height - objectSize.height) ;
    }
}
export = ClientMap;