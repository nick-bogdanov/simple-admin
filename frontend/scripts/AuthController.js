(function (angular) {
  "use strict";

  angular.module('todo')
    .controller('AuthController', AuthController);

  AuthController.$inject = ["$scope", "auth", '$localStorage', '$location', '$rootScope'];

  function AuthController($scope, auth, $localStorage, $location, $rootScope) {

    var self = this;
    //this.error = null;

    this.registerUser = function (form) {
      this.submitted = true;
      if (form) {

        var data = _getData();

        auth.createUser(data).then(function (res) {

          if (!_userSuccess(res)) {
            self.error = res.data.message;
            return self.error;
          }

          _userSuccess(res);

        }).catch(function (err) {
          self.error = err.data.message;
          console.error(err);
        });

      }
    };

    this.login = function (form) {
      this.submitted = true;
      if (form) {
        var data = _getData();

        auth.loginUser({email: data.useremail, pass: data.pass}).then(function (res) {
          if (!_userSuccess(res)) {
            self.error = res.data.message;
            return self.error;
          } else {
            _userSuccess(res);
          }

        }).catch(function (err) {
          self.error = err.message;
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

    function _userSuccess(response) {
      console.log(response);
      if (response.data.success) {
        console.log(response);
        $localStorage.token     = response.data.token;
        $rootScope.isAuthorized = true;
        $location.path('/services-lists');
      } else {
        return false;
      }
    }

  }


})(angular);