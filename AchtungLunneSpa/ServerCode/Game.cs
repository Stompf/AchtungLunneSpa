using System;
using SPATest.Hubs;
using System.Timers;
using System.Threading;

namespace SPATest.ServerCode
{
	public class Game
	{
		public string GroupReference { get; set; }
		public dynamic GroupManager { get; }
		public Map CurrentMap { get; }
		public Player player1 { get; }
		public Player player2 { get; }

		private System.Timers.Timer timer;
        private object updateLock = new object();

		public Game(Player player1, Player player2, MyHub myHub)
		{
			GroupReference = player1.ConnectionId + "-" + player2.ConnectionId + DateTime.Now.ToString();
			CurrentMap = new Map();

			this.player1 = player1;
			this.player1.GameGroupID = GroupReference;
			this.player1.Team = Team.RED;
			this.player1.Position = CurrentMap.GetRandomPosition();

			this.player2 = player2;
			this.player2.Team = Team.BLUE;
			this.player2.GameGroupID = GroupReference;
			this.player2.Position = CurrentMap.GetRandomPosition();

			myHub.Groups.Add(player1.ConnectionId, GroupReference);
			myHub.Groups.Add(player2.ConnectionId, GroupReference);
			GroupManager = myHub.Clients.Group(GroupReference);
		}

		public void InitGame()
		{
			GroupManager.initGame(new InitGameEntity { Map = CurrentMap, Players = new Player[] { player1, player2 } });
		}

		public void ReadyRecived(Player player)
		{
			player.IsReady = true;
			if (player1.IsReady && player2.IsReady)
			{
				StartGame();
			}
		}

		public void StartGame()
		{
			if (timer != null)
			{
				timer.Dispose();
			}

			timer = new System.Timers.Timer(66);
			timer.Elapsed += new ElapsedEventHandler(SendUpdate);
			GroupManager.newGameStart(new NewGameStartEntity() { StartTime = DateTime.Now.AddSeconds(5) });
			Thread.Sleep(5000);		
			timer.Enabled = true; // Enable it
		}

		public void EndGame(MyHub myHub)
		{
			if (timer != null)
			{
				timer.Dispose();
			}

			GroupManager.endGame("end - " + GroupReference);
			myHub.Groups.Remove(player1.ConnectionId, GroupReference);
			myHub.Groups.Remove(player2.ConnectionId, GroupReference);
		}

        public void SendUpdate(object sender, ElapsedEventArgs e)
        {
            lock (updateLock)
            {
				UpdateMap(player1);
				UpdateMap(player2);
				CurrentMap.Tick++;

                var updateEntity = new UpdateGameEntity { Map = CurrentMap, Players = new Player[] { player1, player2 } };
                GroupManager.updateGame(updateEntity);
            }
        }

        public void UpdateRecived(string connectionID, SendUpdateGameEntity entity)
        {
            var player = GetPlayer(connectionID);
            if (player != null && entity.Frame > player.LatestFrameUpdate)
            {
                lock (updateLock)
                {
                    player.Position = entity.Player.Position;
                    player.LatestFrameUpdate = entity.Frame;
                }
            }
        }

        public Player GetPlayer(string connectionID)
		{
			if (player1.ConnectionId == connectionID)
			{
				return player1;
			}
			else if (player2.ConnectionId == connectionID)
			{
				return player2;
			}
			else
			{
				return null;
			}
		}

		public void UpdateMap(Player player)
		{
			var key = CurrentMap.ToMapPartKey(player.Position.X, player.Position.Y);
            if (CurrentMap.MapParts.ContainsKey(key))
			{
				CurrentMap.MapParts[key].Owner = player.ConnectionId;
				CurrentMap.MapParts[key].Color = player.Color;
			}
		}
	}
}