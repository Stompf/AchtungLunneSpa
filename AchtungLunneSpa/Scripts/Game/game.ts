import ko = require("knockout");
import ClientPlayer = require("./ClientPlayer");
import Map = require("./map");
import KeyboardGroup = require("./KeyboardGroup");
import Rendering = require("./Rendering");
import Team = require("./team");
import toastr = require("toastr");
import $ = require('jquery');
import utils = require('../common/Utils');
import moment = require('moment');
import NetworkHandler = require('./NetworkHandler');

class Game {

    ctx: CanvasRenderingContext2D;

	currentLocalPlayers: KnockoutObservableArray<ClientPlayer>;
    currentPlayers: KnockoutObservableArray<ClientPlayer>;
    currentMap: KnockoutObservable<Map>;
    gameOn: KnockoutObservable<boolean>;
    networkHandler: NetworkHandler;

    stopMain: number;
    lastRender: number;
    lastTick: number = performance.now();
    tickLength: number = 50;

	myHub: MyHub;
	connectionID: string;

    private textArea: KnockoutObservable<string>;

    constructor(ctx: CanvasRenderingContext2D, textArea: KnockoutObservable<string>) {
		this.currentLocalPlayers = ko.observableArray<ClientPlayer>();
        this.currentPlayers = ko.observableArray<ClientPlayer>();
        this.currentMap = ko.observable<Map>();
        this.gameOn = ko.observable<boolean>();
        this.lastRender = this.lastTick;
        this.textArea = textArea;

        this.ctx = ctx;
        if (this.ctx != null) {
            this.initCanvas();
			this.searchForGame();
        } else {
            alert("Cannot find canvas!");
        }
    }

	onBlur() {
		var players = this.currentPlayers();
		for (var i = 0; i < players.length; i++) {
            if (players[i].keyboardStates != null) {
                players[i].keyboardStates.resetAll();
            }
        }
	}

    onKeyDown(e: KeyboardEvent) {
        if (!this.gameOn()) {
            return;
        }

        var players = this.currentLocalPlayers();
        for (var i = 0; i < players.length; i++) {
            if (players[i].keyboardStates != null && players[i].keyboardStates.keyDown(e.keyCode)) {
                break;
            }
        }
    }

    onKeyUp(e: KeyboardEvent) {
        if (!this.gameOn()) {
            return;
        }

        var players = this.currentLocalPlayers();
        for (var i = 0; i < players.length; i++) {
            if (players[i].keyboardStates != null && players[i].keyboardStates.keyUp(e.keyCode)) {
                break;
            }
        }
    }

	private searchForGame() {
		this.myHub = $.connection.myHub;

		this.myHub.client.initGame = (message) => {
			this.handleInitGame(message);
		};
        this.myHub.client.newGameStart = (message) => {
			this.handleNewGameStart(message);
		};
		this.myHub.client.endGame = (message) => {
			utils.appendNewLine(this.textArea, message);
			this.currentPlayers.removeAll();
			window.cancelAnimationFrame(this.stopMain);
			this.gameOn(false);
			this.myHub.server.searchForGame();
            this.appendLine('Searching for game...');
		};
		this.myHub.client.updateGame = (message) => {
			this.handleServerUpdate(message);
		};

		$.connection.hub.error(error => {
			this.appendLine('SignalR error: ' + error)
		});

		$.connection.hub.disconnected(() => {
			this.appendLine('SignalR disconnected');
		});

		$.connection.hub.reconnecting(() => {
			this.appendLine('SignalR reconnecting');
		});

		$.connection.hub.start().done(() => {
			this.connectionID = $.connection.hub.id;
            this.myHub.server.searchForGame();
            this.appendLine('Searching for game...');
		});
	}

	private handleInitGame(initGameEntity: GameEntites.InitGameEntity) {
		this.appendLine('InitGame recived');
        this.currentPlayers.removeAll();
        this.networkHandler = new NetworkHandler();

		initGameEntity.players.forEach(player => {
			var clientPlayer: ClientPlayer;
			if (player.connectionId === this.connectionID) {				
				clientPlayer = new ClientPlayer(player, KeyboardGroup.WSAD, true);
				this.appendLine('YOU ARE: <b><span style="color:' + clientPlayer.color + '">' + clientPlayer.color.toUpperCase() + '</span></b>');
				this.currentLocalPlayers([clientPlayer]);
			} else {
				clientPlayer = new ClientPlayer(player, null, false);
			}
			this.currentPlayers.push(clientPlayer);
		});
		this.initMap();
		this.main(performance.now());
		this.myHub.server.sendReady();
		this.appendLine('SendReady sent');
	}

	private handleNewGameStart(newGameStartEntity: GameEntites.NewGameStartEntity) {
		var gameStartInSeconds = moment.duration(moment(utils.getFormatedDateWithTime(newGameStartEntity.startTime)).diff(moment())).asSeconds();
		this.appendLine('Game start in ' + gameStartInSeconds + ' seconds');

		setTimeout(() => {
			this.appendLine('Game start!');
			this.gameOn(true);
		}, gameStartInSeconds * 1000);
	}

	private handleServerUpdate(updateGameEntity: GameEntites.UpdateGameEntity) {
		if (updateGameEntity == null) {
			this.appendLine('<b><span style="color: red">ERROR - UpdateGameEntity was null!</span></b>');
			return;
		}

		updateGameEntity.players.forEach(player => {
			var playerWithId = this.currentPlayers().filter(currPlayer => {
				return currPlayer.connectionId === player.connectionId;
            });

            var isLocalPlayer = this.currentLocalPlayers().some(localPlayer => {
                return localPlayer.connectionId === player.connectionId;
            });

            if (playerWithId.length > 0 && ((!isLocalPlayer && playerWithId[0].latestFrameUpdate < player.latestFrameUpdate) || !this.networkHandler.checkUpdateFromServer(player))) {
				playerWithId[0].position = player.position;
			}
		});
	}

    private main = (tFrame: number) => {
        this.stopMain = window.requestAnimationFrame(this.main);
        var nextTick = this.lastTick + this.tickLength;
        var numTicks = 0;

        if (tFrame > nextTick) {
            var timeSinceTick = tFrame - this.lastTick;
            numTicks = Math.floor(timeSinceTick / this.tickLength);
        }

        this.queueUpdates(numTicks);
        this.redrawCanvas(tFrame);
        this.lastRender = tFrame;

        this.currentLocalPlayers().forEach(localPlayer => {
            var updateObj = < GameEntites.SendUpdateGameEntity > {
                player: localPlayer,
                frame: tFrame
            };

            this.myHub.server.sendUpdate(updateObj).done(() => {
                this.networkHandler.addUpdate(updateObj);
            }).fail(error => {
                this.appendLine('<b> <span style="color: red"> ERROR - SendUpdateGameEntity failed!</span></b> - ' + error);
            });
        });
    }

    private queueUpdates(numTicks: number) {
        for (var i = 0; i < numTicks; i++) {
            this.lastTick = this.lastTick + this.tickLength;
            this.update(Math.floor(this.lastTick));
        }
    }

    private update(lastTick: number) {
        if (this.gameOn() === false) {
            return;
        }

        var players = this.currentPlayers();
        var map = this.currentMap();

        for (var i = 0; i < players.length; i++) {
            players[i].update(this.ctx, map, this.tickLength);
           
            
            /*var victory = localPlayers[i].checkWinningCondition(map);
            if (victory) {
                window.cancelAnimationFrame(this.stopMain);
                this.gameOn(false);
                toastr.success(localPlayers[i].victoryMessage() + ' - New game in 5 secs');

                setTimeout(() => {
                    this.initPlayers();
                    this.main(performance.now());
                    this.gameOn(true);
                }, 5000);

                break;
            }*/
        }

        
    }

    private redrawCanvas(tFrame: number) {
        var deltaTick = tFrame - this.lastTick;
        Rendering.render(this.ctx, this.currentPlayers(), deltaTick, this.currentMap());
    }

    private initCanvas() {
        this.ctx.canvas.tabIndex = 1000;
        this.ctx.canvas.style.outline = "none";

		window.addEventListener("blur",(e) => { this.onBlur(); }, false);
        window.addEventListener("keydown", (e) => { this.onKeyDown(e); }, false);
        window.addEventListener("keyup", (e) => { this.onKeyUp(e); }, false);

        window.addEventListener('mousedown', (e: MouseEvent) => {

        });

        this.appendLine('Canvas init done');
    }

    private initMap() {
        var size = <GameEntites.Size>{
            height: this.ctx.canvas.height,
            width: this.ctx.canvas.width
        };
        this.currentMap(new Map(size));
    }

    private initLocalPlayers() {
        //Player 1
		var serverPlayer1 = <SPATest.ServerCode.Player>{
			team: SPATest.ServerCode.Team.BLUE,
			position: this.currentMap().teamBlueStartPosition
		};
        var player1 = new ClientPlayer(serverPlayer1, KeyboardGroup.WSAD, true);

        //Player 2
		var serverPlayer2 = <SPATest.ServerCode.Player>{
			team: SPATest.ServerCode.Team.RED,
			position: this.currentMap().teamRedStartPosition
		};
        var player2 = new ClientPlayer(serverPlayer2, KeyboardGroup.Arrows, true);
		this.initMap();
        this.currentPlayers([player1, player2]);
        this.currentLocalPlayers(this.currentPlayers());
    }

	private appendLine(message: string) {
		utils.appendNewLine(this.textArea, message);
	}
}
export = Game;