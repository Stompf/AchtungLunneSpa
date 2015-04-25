class AppComponent {

    id: string;
    htmlPath: string;
    jsPath: string;

    constructor(id: string, htmlPath: string, jsPath: string) {
        this.id = id;
        this.htmlPath = htmlPath;
        this.jsPath = jsPath;
    }

}
export = AppComponent; 