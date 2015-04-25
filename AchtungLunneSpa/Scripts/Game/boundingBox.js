define(["require", "exports"], function (require, exports) {
    var BoundingBox = (function () {
        function BoundingBox(topLeft, bottomRight) {
            this.topLeft = topLeft;
            this.bottomRight = bottomRight;
        }
        BoundingBox.prototype.isInBounds = function (position) {
            return position.x >= this.topLeft.x && position.x <= this.bottomRight.x && position.y >= this.topLeft.y && position.y <= this.bottomRight.y;
        };
        return BoundingBox;
    })();
    return BoundingBox;
});
//# sourceMappingURL=BoundingBox.js.map