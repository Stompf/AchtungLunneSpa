import ko = require('knockout');
import $ = require('jquery');
import AppComponent = require('./AppComponent');

class AppMain {
    appComponents: KnockoutObservableArray<AppComponent>;
    selectedAppComponent: KnockoutObservable<AppComponent>;
    baseUrl: string;

    constructor() {
        this.appComponents = ko.observableArray<AppComponent>();
        this.selectedAppComponent = ko.observable<AppComponent>();
    }

    activate() {
        ko.applyBindings(this);
        this.baseUrl = $('#baseURL').html();

        this.loadComponents();
    }

    selectedComponent(id: string, activateContext?: any) {
        const foundComp = ko.utils.arrayFirst(this.appComponents(), app => {
            return app.id === id;
        });
        if (foundComp) {
            this.selectedAppComponent(foundComp);
            this.handleSelectedAppComponentChanged(foundComp, activateContext);
        } else {
            console.error('Could not find app with id: ' + id);
        }
    }

    private loadComponents() {
        var mainMenuComp = new AppComponent('MainMenu', this.baseUrl + 'View/MainMenu', 'viewModels/MainMenuViewModel');
        var gameComp = new AppComponent('Game', this.baseUrl + 'View/Game', 'viewModels/GameViewModel');
        this.appComponents.push(mainMenuComp);
        this.appComponents.push(gameComp);

        this.selectedAppComponent(mainMenuComp);
        this.handleSelectedAppComponentChanged(mainMenuComp);
    }

    private handleSelectedAppComponentChanged(selectedComp: AppComponent, activateContext?: any) {
        if (selectedComp == null) {
            return;
        }

        $('#selectedAppViewPort').empty();
        ko.cleanNode($('#selectedAppViewPort')[0]);

        $.ajax({
            url: selectedComp.htmlPath,
            contentType: 'application/html; charset=utf-8',
            type: 'GET',
            dataType: 'html'
        }).done(htmlresult => {
            require(['../' + selectedComp.jsPath],(foundModule) => {
                if (foundModule == null) {
                    $('#selectedAppViewPort').append('Could not load script with path: ' + selectedComp.jsPath);
                    return;
                }

                var viewModel = new foundModule(this);
                $('#selectedAppViewPort').append(htmlresult);
                ko.applyBindings(viewModel, $('#selectedAppViewPort')[0]);

                //Activate after html is done
                setTimeout(() => {
                    if (viewModel.activate) {
                        viewModel.activate(activateContext);
                    }
                }, 0);
            })
        }).fail(error => {
            $('#selectedAppViewPort').append(error.responseText);
        });

    }

} 
export = AppMain;