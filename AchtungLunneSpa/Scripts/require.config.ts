requirejs.config({
    urlArgs: "bust=" + (new Date()).getTime(),
    paths: {
        'jquery': 'jquery-3.1.1.min',
        'knockout': 'knockout-3.4.1',
        "knockout.validation": "knockout.validation",
        'toastr': 'toastr.min',
        'moment': 'moment.min',
        'signalr.core': 'jquery.signalR-2.2.1.min',
        'signalr.hubs': '/signalr/hubs?'
    },
    shim: {
        "jquery": {
            exports: "$"
        },
        "signalr.core": {
            deps: ["jquery"],
            exports: "$.connection"
        },
        "signalr.hubs": {
            deps: ["signalr.core"],
        },
        "knockout.validation": {
            "deps": ["knockout"]
        }
    }
});

require(["app/appMain", "jquery", "signalr.hubs", "knockout.validation"], function (appMain) {
    var appMain = new appMain();
    appMain.activate();
});