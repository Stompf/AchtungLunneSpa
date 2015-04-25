import BoundingBox = require("./boundingBox");
import ClientPlayer = require("./ClientPlayer");

class Map {

    size: GameEntites.Size;

    teamRedZone: BoundingBox;
    teamRedStartPosition: GameEntites.Vector2D;

    teamBlueZone: BoundingBox;
    teamBlueStartPosition: GameEntites.Vector2D;

    zoneWidth: number = 10;
    startPositionPadding: number = 30;

    constructor(size: GameEntites.Size) {
        this.size = size;
        this.initZones();
        this.initStartPositions();
    }

    render(ctx: CanvasRenderingContext2D, deltaTick: number) {
        this.renderZones(ctx);
    }

    isValidPosition(position: GameEntites.Vector2D, objectSize: GameEntites.Size) {
        return this.isInBounds(position, objectSize);
    }

    resetStartPositions(teamBluePosition: GameEntites.Vector2D, teamRedPosition: GameEntites.Vector2D) {
        teamBluePosition = this.teamBlueStartPosition;
        teamRedPosition = this.teamRedStartPosition;
    } 

    private isInBounds(position: GameEntites.Vector2D, objectSize: GameEntites.Size) {
        return position.x >= 0 &&
            position.x <= (this.size.width - objectSize.width) &&
            position.y >= 0 && position.y <= (this.size.height - objectSize.height) ;
    }

    private renderZones(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = "red";
        ctx.fillRect(this.teamRedZone.topLeft.x, this.teamRedZone.topLeft.y, this.teamRedZone.bottomRight.x, this.teamRedZone.bottomRight.y);

        ctx.fillStyle = "blue";
        ctx.fillRect(this.teamBlueZone.topLeft.x, this.teamBlueZone.topLeft.y, this.teamBlueZone.bottomRight.x, this.teamBlueZone.bottomRight.y);

    }

    private initStartPositions() {
        this.teamBlueStartPosition = <GameEntites.Vector2D> { x: this.size.width - this.startPositionPadding, y: this.size.height / 2 };
        this.teamRedStartPosition = <GameEntites.Vector2D> { x: this.startPositionPadding - 10, y: this.size.height / 2 }; 
    }

    private initZones() {
        this.teamRedZone = new BoundingBox(<GameEntites.Vector2D> { x: 0, y: 0 },
                                           <GameEntites.Vector2D> { x: this.zoneWidth, y: this.size.height});

        this.teamBlueZone = new BoundingBox(<GameEntites.Vector2D> { x: this.size.width - this.zoneWidth, y: 0 },
                                            <GameEntites.Vector2D> { x: this.size.width, y: this.size.height });
    }
}
export = Map;