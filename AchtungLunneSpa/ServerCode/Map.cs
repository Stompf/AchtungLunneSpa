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

		private int StartPositionPadding = 30;
		private Random _random;

		public Map()
		{
			MapSize = new Size() { Height = 500, Width = 1000 };
			_random = new Random(DateTime.Now.Millisecond);
		}

		public Vector2D GetRandomPosition()
		{
			var randX = _random.Next(5, MapSize.Width - 5);
			var randY = _random.Next(5, MapSize.Height - 5);
			return new Vector2D { X = randX, Y = randY };
        }
	}
}