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
        this.selectedAppComponent.subscribe(selectedComp => {
            this.handleSelectedAppComponentChanged(selectedComp);
        });
    }

    activate() {
        ko.applyBindings(this);
        this.baseUrl = $('#baseURL').html();

        this.loadComponents();
    }

    loadComponents() {
        var comp = new AppComponent('Game', this.baseUrl + 'View/Game', 'viewModels/GameViewModel');
        this.appComponents.push(comp);
        this.selectedAppComponent(comp);
    }

    private handleSelectedAppComponentChanged(selectedComp: AppComponent) {
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
                        viewModel.activate();
                    }
                }, 0);
            })
        }).fail(error => {
            $('#selectedAppViewPort').append(error.responseText);
        });

    }

} 
export = AppMain;