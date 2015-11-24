(function (angular) {
  "use strict";

  angular.module('todo')
    .controller('AuthController', RegisterController);

  RegisterController.$inject        = ["$scope", "auth"];
  ConfirmRegisterController.$inject = ["check", "$location"];

  function RegisterController($scope, auth) {

    var self = this;

    this.registerUser = function (form) {

      if (form) {

        var data = _getData();

        auth.createUser(data).then(function (res) {
          console.log(res.data);
          _showResult(res.data);
        }).catch(function (err) {
          self.error = "Some errors on server. Please reload page and try again.";
          console.log(err);
        });

      }
    };

    this.loginUser = function (form) {
      if (form) {
        var data = _getData();

        auth.loginUser(data).then(function (res) {
          console.log(res);
        }).catch(function (err) {
          console.log(err);
        });
      }
    };

    function _getData() {
      return {
        username : $scope.username,
        useremail: $scope.useremail,
        pass     : $scope.pass
      };
    }

    function _showResult(result) {
      var message = result.extras.message;
      self.error  = null;
      self.done   = null;

      if (result.success) {
        self.done = message;
      } else {
        self.error = message;
      }

    }

  }

  function ConfirmRegisterController(check, $location) {
    var confirm = check.success;
    console.log(check);
    if (confirm) {
      $location.path("/home");
    } else {
      console.log(false);
      $location.path("/bad-permission");
    }

  }


})(angular);