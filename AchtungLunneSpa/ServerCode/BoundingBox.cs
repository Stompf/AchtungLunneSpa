using TypeLite;

namespace SPATest.ServerCode
{
    [TsClass]
    public class BoundingBox
    {
        public Vector2D TopLeft { get; set; }
        public Vector2D BottomRight { get; set; }

        public BoundingBox(Vector2D topLeft, Vector2D bottomRight)
        {
            TopLeft = topLeft;
            BottomRight = bottomRight;
        }

        public bool isInBounds(Vector2D position)
        {
            return position.X >= TopLeft.X &&
                position.X <= BottomRight.X &&
                position.Y >= TopLeft.Y &&
                position.Y <= BottomRight.Y;
        }
    }
}