import AppMain = require('../app/appMain');
import ko = require('knockout');
import utils = require('../common/Utils');
import moment = require('moment');
import ClientPlayer = require("../game/ClientPlayer");
import ClientMap = require("../game/ClientMap");
import Rendering = require("../game/Rendering");
import Team = require("../game/Team");
import toastr = require("toastr");
import $ = require('jquery');
import NetworkHandler = require('../game/NetworkHandler');

class GameViewModel {
    appMain: AppMain;
    textArea: KnockoutObservable<string>;

    ctx: CanvasRenderingContext2D;

    currentLocalPlayers: KnockoutObservableArray<ClientPlayer>;
    currentPlayers: KnockoutObservableArray<ClientPlayer>;
    currentMap: KnockoutObservable<ClientMap>;
    gameOn: KnockoutObservable<boolean>;
    networkHandler: NetworkHandler;

    mainAnimationReference: number;
    lastRender: number;
    lastTick: number = performance.now();
    tickLength: number = 50;

    myHub: MyHub;
    connectionID: string;

    constructor(app: AppMain) {
        this.appMain = app;
        this.textArea = ko.observable<string>(moment().format('HH:mm:ss') + ' - Welcome!');
        this.currentLocalPlayers = ko.observableArray<ClientPlayer>();
        this.currentPlayers = ko.observableArray<ClientPlayer>();
        this.currentMap = ko.observable<ClientMap>();
        this.gameOn = ko.observable<boolean>();
        this.lastRender = this.lastTick;
    }

    activate() {
        utils.appendNewLine(this.textArea, 'Activate');
        this.ctx = (<HTMLCanvasElement>document.getElementById("gameCanvas")).getContext("2d");
        if (this.ctx != null) {
            this.initCanvas();
            const localgame = true;

            if (localgame) {
                this.startLocalGame();
            } else {
                this.searchForGame();
            }
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

    private startLocalGame() {
        this.appendLine('Starting local game...');
        this.initLocalMap();
        this.initLocalPlayers();
        this.main(performance.now());

        const startTimeInSec = 3;
        this.appendLine('Starting in ' + startTimeInSec + ' seconds...');
        setTimeout(() => {
            this.currentPlayers().forEach(player => {
                player.haveCurrentHole = false;
                player.currentHoleEndTime = new Date();
            });
            this.gameOn(true);
        }, startTimeInSec * 1000);
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
            window.cancelAnimationFrame(this.mainAnimationReference);
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
            this.gameOn(false);
            this.connectionID = $.connection.hub.id;
            this.myHub.server.searchForGame();
            this.appendLine('Searching for game...');
        });
    }

    private handleInitGame(initGameEntity: SPATest.ServerCode.InitGameEntity) {
        this.appendLine('InitGame recived');
        this.gameOn(false);
        this.currentPlayers.removeAll();
        this.networkHandler = new NetworkHandler();

        initGameEntity.players.forEach(player => {
            var clientPlayer: ClientPlayer;
            if (player.connectionId === this.connectionID) {
                clientPlayer = new ClientPlayer(player, LunnEngine.KeyboardGroup.WSAD, true);
                this.appendLine('YOU ARE: <b><span style="color:' + clientPlayer.color + '">' + clientPlayer.color.toUpperCase() + '</span></b>');
                this.currentLocalPlayers([clientPlayer]);
            } else {
                clientPlayer = new ClientPlayer(player, null, false);
            }
            this.currentPlayers.push(clientPlayer);
        });
        this.initMap(initGameEntity.map);
        this.main(performance.now());
        this.myHub.server.sendReady();
        this.appendLine('SendReady sent');
    }

    private handleNewGameStart(newGameStartEntity: SPATest.ServerCode.NewGameStartEntity) {
        var gameStartInSeconds = moment.duration(moment(utils.getFormatedDateWithTime(newGameStartEntity.startTime)).diff(moment())).asSeconds();
        this.appendLine('Game start in ' + gameStartInSeconds + ' seconds');

        setTimeout(() => {
            this.appendLine('Game start!');
            this.gameOn(true);
        }, gameStartInSeconds * 1000);
    }

    private handleServerUpdate(updateGameEntity: SPATest.ServerCode.UpdateGameEntity) {
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
            this.currentMap().addMapPart(player);

            if (!player.isAlive && player.isAlive !== playerWithId[0].isAlive) {
                playerWithId[0].isAlive = false;
                this.appendLine('Player: ' + player.color + ' died!');
                this.gameOn(false);
            }
        });
    }

    private main = (tFrame: number) => {
        this.mainAnimationReference = window.requestAnimationFrame(this.main);
        var nextTick = this.lastTick + this.tickLength;
        var numTicks = 0;

        if (tFrame > nextTick) {
            var timeSinceTick = tFrame - this.lastTick;
            numTicks = Math.floor(timeSinceTick / this.tickLength);
        }

        this.queueUpdates(numTicks);
        this.redrawCanvas(tFrame);
        this.lastRender = tFrame;

        if (this.networkHandler != null) {
            this.sendNetworkUpdates(tFrame);
        }
    }

    private sendNetworkUpdates(tFrame: number) {
        this.currentLocalPlayers().forEach(localPlayer => {
            var updateObj = <SPATest.ServerCode.SendUpdateGameEntity>{
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
        if (!this.gameOn()) {
            return;
        }

        const map = this.currentMap();
        this.currentLocalPlayers().forEach(player => {
            player.update(this.ctx, map, this.tickLength);
        });

        if (this.networkHandler == null) {
            this.currentMap().update(this.currentLocalPlayers(), this.textArea);

            const alivePlayers = this.currentPlayers().filter(player => {
                return player.isAlive;
            });

            if (alivePlayers.length === 1) {
                utils.appendNewLine(this.textArea, alivePlayers[0].Name + ' won!');
                cancelAnimationFrame(this.mainAnimationReference);
                alivePlayers[0].score(alivePlayers[0].score() + 1);
            } else if (alivePlayers.length === 0) {
                utils.appendNewLine(this.textArea, 'Draw!');
                cancelAnimationFrame(this.mainAnimationReference);
            }
        }
    }

    private redrawCanvas(tFrame: number) {
        var deltaTick = tFrame - this.lastTick;
        Rendering.render(this.ctx, this.currentPlayers(), deltaTick, this.currentMap());
    }

    private initCanvas() {
        this.ctx.canvas.tabIndex = 1000;
        this.ctx.canvas.style.outline = "none";

        window.addEventListener("blur", (e) => { this.onBlur(); }, false);
        window.addEventListener("keydown", (e) => { this.onKeyDown(e); }, false);
        window.addEventListener("keyup", (e) => { this.onKeyUp(e); }, false);

        this.appendLine('Canvas init done');
    }

    private initMap(map: SPATest.ServerCode.Map) {
        var size = <SPATest.ServerCode.Size>{
            height: this.ctx.canvas.height,
            width: this.ctx.canvas.width
        };
        this.currentMap(new ClientMap(map));
    }

    private initLocalPlayers() {
        //Player 1
        var serverPlayer1 = <SPATest.ServerCode.Player>{
            team: SPATest.ServerCode.Team.BLUE,
            position: this.currentMap().getRandomStartPosition(),
            connectionId: 'player1'
        };
        var player1 = new ClientPlayer(serverPlayer1, LunnEngine.KeyboardGroup.WSAD, true);

        //Player 2
        var serverPlayer2 = <SPATest.ServerCode.Player>{
            team: SPATest.ServerCode.Team.RED,
            position: this.currentMap().getRandomStartPosition(),
            connectionId: 'player2'
        };
        var player2 = new ClientPlayer(serverPlayer2, LunnEngine.KeyboardGroup.Arrows, true);

        this.currentPlayers([player1, player2]);
        this.currentLocalPlayers(this.currentPlayers());
    }

    private initLocalMap() {
        var settings = <SPATest.ServerCode.Map>{
            mapSize: <SPATest.ServerCode.Size>{
                height: this.ctx.canvas.height,
                width: this.ctx.canvas.width
            },
            playerSize: 10,
            startPositionPadding: 100,
            tick: 0
        };

        this.initMap(settings);
    }

    private appendLine(message: string) {
        utils.appendNewLine(this.textArea, message);
    }
}
export = GameViewModel;