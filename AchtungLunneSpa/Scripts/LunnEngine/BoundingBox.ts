class BoundingBox implements SPATest.ServerCode.BoundingBox {

    topLeft: SPATest.ServerCode.Vector2D;
    bottomRight: SPATest.ServerCode.Vector2D;

    constructor(topLeft: SPATest.ServerCode.Vector2D, bottomRight: SPATest.ServerCode.Vector2D) {
        this.topLeft = topLeft;
        this.bottomRight = bottomRight;
    }

    isInBounds(position: SPATest.ServerCode.Vector2D) {
        return position.x >= this.topLeft.x &&
            position.x <= this.bottomRight.x &&
            position.y >= this.topLeft.y &&
            position.y <= this.bottomRight.y;
    }

}
export = BoundingBox;