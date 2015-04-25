using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using TypeLite;

namespace SPATest.ServerCode
{
    [TsClass]
    public class NewGameStartEntity
    {
        public DateTime StartTime { get; set; }
    }

	[TsClass]
	public class InitGameEntity
	{
		public Map Map { get; set; }
		public Player[] Players { get; set; }
	}


	[TsClass]
	public class UpdateGameEntity
	{
		public Map Map { get; set; }
		public Player[] Players { get; set; }
	}

	[TsClass]
	public class SendUpdateGameEntity
	{
		public Player Player { get; set; }
		
		public float Frame { get; set; }
	}

	[TsClass]
    public class Vector2D
    {
        public int X { get; set; }
        public int Y { get; set; }
    }

    [TsClass]
    public class Size
    {
        public int Height { get; set; }
        public int Width { get; set; }
    }

	[TsEnum]
	public enum Team
	{
		BLUE,
		RED
	}
}