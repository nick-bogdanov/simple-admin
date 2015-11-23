(function (angular) {
  "use strict";

  function RegisterController($scope, auth) {

    var self = this;

    this.registerUser = function (form) {

      if (form) {

        var data = _getData();

        auth.createUser(data).then(function (res) {
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

        auth.loginUser(data).then(function(res) {
          console.log(res);
        });
      }
    };

    function _getData() {
      return {
        userName : $scope.userName,
        userEmail: $scope.userEmail,
        userPass : $scope.userPass
      };
    }

    function _showResult(result) {
      var message = result.extras.message;
      self.error  = null;
      self.done   = null;

      if (result.success) {
        self.done = message;
      }else{
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


  angular.module('todo')
    .controller('AuthController', RegisterController);

  RegisterController.$inject        = ["$scope", "auth"];
  ConfirmRegisterController.$inject = ["check", "$location"];


})(angular);