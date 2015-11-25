(function (angular) {
  "use strict";

  angular.module('todo')
    .controller('AuthController', AuthController);

  AuthController.$inject = ["$scope", "auth", '$localStorage', '$location'];

  function AuthController($scope, auth, $localStorage, $location) {

    var self = this;

    this.registerUser = function (form) {

      if (form) {

        var data = _getData();

        auth.createUser(data).then(function (res) {
          //console.log(res);
          _userSuccess(res);
        }).catch(function (err) {
          self.error = "Some errors on server. Please reload page and try again.";
          console.error(err);
        });

      }
    };

    this.login = function (form) {
      if (form) {
        var data = _getData();

        auth.loginUser({email: data.useremail, pass: data.pass}).then(function (res) {
          console.log(res);
          _userSuccess(res);
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

    function _userSuccess(response) {
      console.log(response);
      if (response.data.success) {
        $localStorage.token = response.data.extras.token;
        console.log('token are set');
        $location.path('/services-lists');
      }else{
        console.error('User is not success');
      }
    }

  }


})(angular);