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
          console.log(res);
          if (res.data.success) {
            $localStorage.token = res.data.extras.info;
            console.log('token are set');
            $location.path('/services-lists');
          }

          //$location.path('/#/services-lists');
        }).catch(function (err) {
          self.error = "Some errors on server. Please reload page and try again.";
          console.error(err);
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

  }


})(angular);