import BoundingBox = require("../lunnEngine/BoundingBox");
import ClientPlayer = require("./ClientPlayer");
import utils = require('../common/Utils');
import ko = require('knockout');
import collections = require('../collections');
import moment = require('moment');

class ClientMap {
    mapSize: SPATest.ServerCode.Size;
    mapParts: collections.Dictionary<string, boolean>;
    renderMapParts: collections.Dictionary<string, SPATest.ServerCode.MapPart>;
    playerSize: number;
    startPositionPadding: number;
    startPositionPaddingOtherPlayers: number = 150;

    holePerCentChance = 3.5;
    holeMinTimeIntervalInSec = 3;
    holeMinLengthInSec = 0.3;
    holeMaxLengthInSec = 0.5;

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
        this.handlePlayerHoles(players);
        this.handlePlayerMovementAndCollisions(players, textArea);
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

    getRandomStartPosition(playerPositions: Array<SPATest.ServerCode.Vector2D>) {
        const randX = utils.getRandomInt(this.startPositionPadding, this.mapSize.width - this.startPositionPadding);
        const randY = utils.getRandomInt(this.startPositionPadding, this.mapSize.height - this.startPositionPadding);

        const tooCloseOtherPosition = playerPositions.some(position => {
            return Math.abs(position.x - randX) <= this.startPositionPaddingOtherPlayers && Math.abs(position.y - randY) <= this.startPositionPaddingOtherPlayers;
        });

        if (tooCloseOtherPosition) {
            return this.getRandomStartPosition(playerPositions);
        } else {
            return <SPATest.ServerCode.Vector2D>{
                x: randX,
                y: randY
            };
        }
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

    private handlePlayerHoles(players: Array<ClientPlayer>) {
        players.forEach(player => {
            if (player.isAlive) {
                const now = new Date();
                if (player.haveCurrentHole && now.getTime() >= player.currentHoleEndTime.getTime()) {
                    player.haveCurrentHole = false;
                } else if (moment(player.currentHoleEndTime).add(this.holeMinTimeIntervalInSec, 'seconds').toDate().getTime() <= now.getTime()
                    && Math.random() * 100 <= this.holePerCentChance) {

                    player.haveCurrentHole = true;
                    const time = Math.min(this.holeMaxLengthInSec, this.holeMinLengthInSec + Math.random());

                    player.currentHoleEndTime = moment(now).add(time, 'seconds').toDate();
                }
            } else {
                player.haveCurrentHole = false;
            }
        });
    }

    private handlePlayerMovementAndCollisions(players: Array<ClientPlayer>, textArea: KnockoutObservable<string>) {
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
                            } else if (!player.haveCurrentHole) {
                                this.mapParts.setValue(this.toMapPartKey(player.position.x + x, player.position.y + y), true);
                            }
                        }
                    }

                    if (!player.haveCurrentHole) {
                        const part = <SPATest.ServerCode.MapPart>{
                            color: player.color,
                            owner: player.connectionId,
                            x: player.position.x,
                            y: player.position.y
                        };
                        this.renderMapParts.setValue(this.toMapPartKey(player.position.x, player.position.y), part);
                    }
                }
            }
        });
    }
}
export = ClientMap;