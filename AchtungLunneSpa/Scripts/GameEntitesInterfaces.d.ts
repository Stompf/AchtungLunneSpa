
 
 

 

/// <reference path="Enums.ts" />

declare module SPATest.ServerCode {
	interface NewGameStartEntity {
		startTime: string;
	}
	interface InitGameEntity {
		map: SPATest.ServerCode.Map;
		players: SPATest.ServerCode.Player[];
	}
	interface Map {
		mapSize: SPATest.ServerCode.Size;
		tick: number;
		playerSize: number;
		startPositionPadding: number;
	}
	interface Size {
		height: number;
		width: number;
	}
	interface Player {
		lastPositionVector: SPATest.ServerCode.BoundingBox;
		isAlive: boolean;
		connectionId: string;
		position: SPATest.ServerCode.Vector2D;
		color: string;
		team: SPATest.ServerCode.Team;
		startSize: SPATest.ServerCode.Size;
		latestFrameUpdate: number;
	}
	interface BoundingBox {
		topLeft: SPATest.ServerCode.Vector2D;
		bottomRight: SPATest.ServerCode.Vector2D;
	}
	interface Vector2D {
		x: number;
		y: number;
	}
	interface UpdateGameEntity {
		map: SPATest.ServerCode.Map;
		players: SPATest.ServerCode.Player[];
	}
	interface SendUpdateGameEntity {
		player: SPATest.ServerCode.Player;
		frame: number;
	}
	interface MapPart {
		x: number;
		y: number;
		owner: string;
		color: string;
	}
}


