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

		public Vector2D TeamBlueStartPosition { get; }
		public Vector2D TeamRedStartPosition { get; }

		private int StartPositionPadding = 30;

		public Map()
		{
			MapSize = new Size() { Height = 500, Width = 1000 };
			TeamBlueStartPosition = new Vector2D { X = MapSize.Width - StartPositionPadding, Y = MapSize.Height / 2 };
			TeamRedStartPosition = new Vector2D { X = StartPositionPadding - Player.StartSize.Width, Y = MapSize.Height / 2 };
		}
	}
}