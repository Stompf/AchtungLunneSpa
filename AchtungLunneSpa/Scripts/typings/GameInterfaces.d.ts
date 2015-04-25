interface MyHubClient {
    newGameStart(obj: GameEntites.NewGameStartEntity): void
	endGame(message: string): void;
	initGame(obj: GameEntites.InitGameEntity): void;
	updateGame(obj: GameEntites.UpdateGameEntity): void;
}

interface MyHubServer {
	searchForGame(): void;
	sendReady(): void;
	sendUpdate(updateObj: GameEntites.SendUpdateGameEntity): JQueryPromise<any>;
}

interface MyHub {
	client: MyHubClient;
	server: MyHubServer;
}

interface SignalR {
	myHub: MyHub;
}

declare module 'toastr' {
    export = toastr;
}