declare module GameEntites {
	export enum Team {
		BLUE = 0,
		RED = 1
	}

	interface NewGameStartEntity {
		startTime: string;
	}
	interface InitGameEntity {
		map: SPATest.ServerCode.Map;
		players: SPATest.ServerCode.Player[];
	}
	interface Map {
		mapSize: SPATest.ServerCode.Size;
		teamBlueStartPosition: SPATest.ServerCode.Vector2D;
		teamRedStartPosition: SPATest.ServerCode.Vector2D;
	}
	interface Size {
		height: number;
		width: number;
	}
	interface Vector2D {
		x: number;
		y: number;
	}
	interface Player {
		connectionId: string;
		position: SPATest.ServerCode.Vector2D;
		color: string;
		team: SPATest.ServerCode.Team;
		startSize: SPATest.ServerCode.Size;
	}
	interface UpdateGameEntity {
		map: SPATest.ServerCode.Map;
		players: SPATest.ServerCode.Player[];
	}
	interface SendUpdateGameEntity {
		player: SPATest.ServerCode.Player;
		frame: number;
	}
}