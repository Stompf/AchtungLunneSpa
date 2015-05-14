using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using TypeLite;

namespace SPATest.ServerCode
{
    [TsClass]
    public class Map
    {
        public Size MapSize { get; }
        private Dictionary<string, MapPart> MapParts { get; }
        public int Tick { get; set; }
        public int PlayerSize { get; }

        public int StartPositionPadding { get; }
        private Random _random;

        public Map()
        {
            PlayerSize = 10;
            StartPositionPadding = 30;
            Tick = 0;
            MapSize = new Size() { Height = 500, Width = 1000 };
            _random = new Random(DateTime.Now.Millisecond);
            MapParts = new Dictionary<string, MapPart>();
            ResetMapParts();
        }

        public Vector2D GetRandomPosition()
        {
            var randX = _random.Next(StartPositionPadding, MapSize.Width - StartPositionPadding);
            var randY = _random.Next(StartPositionPadding, MapSize.Height - StartPositionPadding);
            return new Vector2D { X = randX, Y = randY };
        }

        public void ResetMapParts()
        {
            MapParts.Clear();
            for (int x = 0; x < MapSize.Width; x++)
            {
                for (int y = 0; y < MapSize.Height; y++)
                {
                    MapParts[ToMapPartKey(x, y)] = new MapPart(x, y);
                }
            }
        }

        public bool AddMapPart(Vector2D position, Player player)
        {
            for (int x = 0; x < PlayerSize; x++)
            {
                for (int y = 1; y < PlayerSize; y++)
                {
                    var key = ToMapPartKey(position.X + x, position.Y + y);
                    if (!MapParts.ContainsKey(key) || (MapParts[key].Owner != null && !player.LastPositionVector.isInBounds(new Vector2D() { X = position.X + x, Y = position.Y + y })))
                    {
                        return false;
                    }
                    else
                    {
                        MapParts[key].Color = player.Color;
                        MapParts[key].Owner = player.ConnectionId;
                    }
                }
            }
            player.LastPositionVector = new BoundingBox(player.Position, new Vector2D() { X = player.Position.X + PlayerSize, Y = player.Position.Y + PlayerSize });
            return true;
        }

        public void UpdateMap(Player player)
        {
            var key = ToMapPartKey(player.Position.X, player.Position.Y);
            if (MapParts.ContainsKey(key))
            {
                MapParts[key].Owner = player.ConnectionId;
                MapParts[key].Color = player.Color;
            }
        }

        public string ToMapPartKey(int X, int Y)
        {
            return X + "_" + Y;
        }
    }
}