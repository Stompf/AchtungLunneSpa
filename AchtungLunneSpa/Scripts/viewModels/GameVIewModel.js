define(["require", "exports", '../Game/game', 'knockout', '../common/Utils', 'moment'], function (require, exports, Game, ko, utils, moment) {
    var GameViewModel = (function () {
        function GameViewModel(app) {
            this.appMain = app;
            this.textArea = ko.observable(moment().format('HH:mm:ss') + ' - Welcome!');
        }
        GameViewModel.prototype.activate = function () {
            utils.appendNewLine(this.textArea, 'Activate');
            this.game = new Game(document.getElementById("gameCanvas").getContext("2d"), this.textArea);
        };
        return GameViewModel;
    })();
    return GameViewModel;
});
//# sourceMappingURL=GameVIewModel.js.map