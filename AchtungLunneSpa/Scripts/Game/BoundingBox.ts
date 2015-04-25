class BoundingBox {

    topLeft: GameEntites.Vector2D;
    bottomRight: GameEntites.Vector2D;

    constructor(topLeft: GameEntites.Vector2D, bottomRight: GameEntites.Vector2D) {
        this.topLeft = topLeft;
        this.bottomRight = bottomRight;
    }

    isInBounds(position: GameEntites.Vector2D) {
        return position.x >= this.topLeft.x &&
            position.x <= this.bottomRight.x &&
            position.y >= this.topLeft.y &&
            position.y <= this.bottomRight.y;
    }

}
export = BoundingBox;