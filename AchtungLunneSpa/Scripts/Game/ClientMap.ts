import BoundingBox = require("../LunnEngine/BoundingBox");
import ClientPlayer = require("./ClientPlayer");
import utils = require('../common/Utils');
import ko = require('knockout');
import collections = require('../collections');

class ClientMap {
    mapSize: SPATest.ServerCode.Size;
    mapParts: collections.Dictionary<string, boolean>;
    renderMapParts: collections.Dictionary<string, SPATest.ServerCode.MapPart>;
    playerSize: number;
    startPositionPadding: number;

    constructor(serverMap: SPATest.ServerCode.Map) {
        this.mapSize = serverMap.mapSize;
        this.playerSize = serverMap.playerSize;
        this.startPositionPadding = serverMap.startPositionPadding;
        this.mapParts = new collections.Dictionary<string, boolean>();
        this.renderMapParts = new collections.Dictionary<string, SPATest.ServerCode.MapPart>();

        this.resetMapParts();
    }

    resetMapParts() {
        this.mapParts.clear();
        this.renderMapParts.clear();
    }

    update(players: Array<ClientPlayer>, textArea: KnockoutObservable<string>) {
        players.forEach(player => {
            if (player.isAlive) {
                if (!this.isValidPosition(player.position, player.size)) {
                    player.isAlive = false;
                    utils.appendNewLine(textArea, player.Name + ' died');
                } else {
                    for (let x = 0; x < player.size.width; x++) {
                        for (let y = 0; y < player.size.height; y++) {
                            const key = this.toMapPartKey(player.position.x + x, player.position.y + y);
                            if (this.mapParts.containsKey(key) && !player.previousPosition.isInBounds({ x: player.position.x + x, y: player.position.y + y })) {
                                player.isAlive = false;
                                utils.appendNewLine(textArea, player.Name + ' died');
                                return;
                            } else {
                                this.mapParts.setValue(this.toMapPartKey(player.position.x + x, player.position.y + y), true);
                            }
                        }
                    }

                    const part = <SPATest.ServerCode.MapPart>{
                        color: player.color,
                        owner: player.connectionId,
                        x: player.position.x,
                        y: player.position.y
                    };
                    this.renderMapParts.setValue(this.toMapPartKey(player.position.x, player.position.y), part);
                }
            }
        });
    }

    render(ctx: CanvasRenderingContext2D, deltaTick: number) {
        if (this.renderMapParts == null) {
            return;
        }

        this.renderMapParts.values().forEach(mapPart => {
            ctx.fillStyle = mapPart.color;
            ctx.fillRect(mapPart.x, mapPart.y, this.playerSize, this.playerSize);
        });
    }

    isValidPosition(position: SPATest.ServerCode.Vector2D, objectSize: SPATest.ServerCode.Size) {
        return this.isInBounds(position, objectSize);
    }

    getRandomStartPosition() {
        const randX = utils.getRandomInt(this.startPositionPadding, this.mapSize.width - this.startPositionPadding);
        const randY = utils.getRandomInt(this.startPositionPadding, this.mapSize.height - this.startPositionPadding);
        return <SPATest.ServerCode.Vector2D>{
            x: randX,
            y: randY
        };
    }

    toMapPartKey(x: number, y: number) {
        return x + '_' + y;
    }

    addMapPart(player: SPATest.ServerCode.Player) {
        if (this.renderMapParts == null) {
            return;
        }

        this.renderMapParts.setValue(this.toMapPartKey(player.position.x, player.position.y), <SPATest.ServerCode.MapPart>{
            color: player.color,
            owner: player.connectionId,
            x: player.position.x,
            y: player.position.y
        });
    }

    private isInBounds(position: SPATest.ServerCode.Vector2D, objectSize: SPATest.ServerCode.Size) {
        return position.x >= 0 &&
            position.x <= (this.mapSize.width - objectSize.width) &&
            position.y >= 0 && position.y <= (this.mapSize.height - objectSize.height);
    }
}
export = ClientMap;