interface MyHubClient {
    newGameStart(obj: SPATest.ServerCode.NewGameStartEntity): void
	endGame(message: string): void;
	initGame(obj: SPATest.ServerCode.InitGameEntity): void;
	updateGame(obj: SPATest.ServerCode.UpdateGameEntity): void;
}

interface MyHubServer {
	searchForGame(): void;
	sendReady(): void;
	sendUpdate(updateObj: SPATest.ServerCode.SendUpdateGameEntity): JQueryPromise<any>;
}

interface MyHub {
	client: MyHubClient;
	server: MyHubServer;
}

interface SignalR {
	myHub: MyHub;
}

declare namespace AchtungLunne {
    interface GameSettings {
        scoreToWin: number;
        gameSpeed: number;
    }
}