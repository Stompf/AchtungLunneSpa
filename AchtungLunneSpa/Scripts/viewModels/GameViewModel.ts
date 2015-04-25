import AppMain = require('../app/appMain');
import Game = require('../Game/game');
import ko = require('knockout');
import utils = require('../common/Utils');
import moment = require('moment');

class GameViewModel {
    appMain: AppMain;
    game: Game;
    textArea: KnockoutObservable<string>;

    constructor(app: AppMain) {
        this.appMain = app;
        this.textArea = ko.observable<string>(moment().format('HH:mm:ss') + ' - Welcome!');
    }

    activate() {
        utils.appendNewLine(this.textArea, 'Activate');
        this.game = new Game((<HTMLCanvasElement>document.getElementById("gameCanvas")).getContext("2d"), this.textArea);
    }

}
export = GameViewModel;