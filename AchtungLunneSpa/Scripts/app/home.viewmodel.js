define(["require", "exports"], function (require, exports) {
    var HomeViewModel = (function () {
        function HomeViewModel(app) {
            /* Sammy(function () {
                  this.get('#home', function () {
                      // Make a call to the protected Web API by passing in a Bearer Authorization Header
                      $.ajax({
                          method: 'get',
                          url: app.dataModel.userInfoUrl,
                          contentType: "application/json; charset=utf-8",
                          success: function (data) {
                              self.myHometown('Your Hometown is : ' + data.hometown);
                          }
                      });
                  });*/
            Sammy().get('/', function () {
                this.app.runRoute('get', '#home');
            });
            app.addViewModel({
                name: "Home",
                bindingMemberName: "home",
                factory: HomeViewModel
            });
        }
        return HomeViewModel;
    })();
    return HomeViewModel;
});
//# sourceMappingURL=home.viewmodel.js.map