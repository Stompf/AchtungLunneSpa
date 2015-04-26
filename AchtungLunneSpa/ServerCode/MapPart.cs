using TypeLite;

namespace SPATest.ServerCode
{
	[TsClass]
	public class MapPart
	{
		public int X { get; }
		public int Y { get; }

		public string Owner { get; set; }

		public string Color { get; set; }

		public MapPart(int X, int Y)
		{
			this.X = X;
			this.Y = Y;
			Color = "#FFFFFF";
		}
	}
}