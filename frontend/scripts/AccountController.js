(function(angular) {
  "use strict";

  function RegisterController($scope, auth) {

    this.registerUser = function(form) {

      if (form) {
        var self = this;
        var data = {
          userName: $scope.userName,
          userEmail: $scope.userEmail,
          userPass: $scope.userPass
        };

        this.error = null;
        this.done = null;

        auth.createUser(data).then(function(res) {
          console.log(res);
          if (!res.success) {
            self.error = res.extras.message;
          }
          if (res.success) {
            self.done = true;
          }
        }).catch(function(err) {
          self.error = "Some errors on server. Please reload page and try again.";
          console.log(err);
        });

      }
    };

  }

  function ConfirmRegisterController(check, $location) {
    var confirm = check.success;
    console.log(check);
    if (confirm) {
      $location.path("/home");
    }else{
      console.log(false);
      $location.path("/bad-permission");
    }

  }


  angular.module('todo')
    .controller('AuthController', RegisterController);

  RegisterController.$inject = ["$scope", "auth"];
  ConfirmRegisterController.$inject = ["check", "$location"];


})(angular);