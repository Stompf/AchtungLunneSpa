import AppMain = require('../app/appMain');
import ko = require('knockout');

class MainMenuViewModel {

    scoreToWin: KnockoutObservable<number>;

    private state: KnockoutObservable<MainMenuViewModel.MainMenuState>;
    private appMain: AppMain;
    private errors: KnockoutValidationErrors;

    constructor(app: AppMain) {
        this.appMain = app;
        this.scoreToWin = ko.observable(5).extend({ min: 1, max: 9999 });
        this.state = ko.observable(MainMenuViewModel.MainMenuState.Main);

        this.errors = ko.validation.group(this);
    }

    activate() {
        
    }

    isMainVisible = ko.pureComputed({
        read: () => {
            return this.state() === MainMenuViewModel.MainMenuState.Main;
        },
        deferEvaluation: true,
        owner: this
    });

    isCustomSettingVisible = ko.pureComputed({
        read: () => {
            return this.state() === MainMenuViewModel.MainMenuState.CustomSettings;
        },
        deferEvaluation: true,
        owner: this
    });

    isMatchmakingVisible = ko.pureComputed({
        read: () => {
            return this.state() === MainMenuViewModel.MainMenuState.Matchmaking;
        },
        deferEvaluation: true,
        owner: this
    });

    matchmakingClicked = () => {
        this.state(MainMenuViewModel.MainMenuState.Matchmaking);
    };

    customGameClicked = () => {
        this.state(MainMenuViewModel.MainMenuState.CustomSettings);
    };

    backClicked = () => {
        this.state(MainMenuViewModel.MainMenuState.Main);
    };

    startCustomGameClicked = () => {
        if (this.errors().length > 0) {
            this.errors.showAllMessages(true);
            return;
        }

        const settings = <AchtungLunne.GameSettings>{
            scoreToWin: this.scoreToWin()
        };
        this.appMain.selectedComponent('Game', settings);
    };
}

module MainMenuViewModel {
    export enum MainMenuState {
        Main,
        Matchmaking,
        CustomSettings
    }
}

export = MainMenuViewModel;