(function (angular) {
  "use strict";

  angular.module('todo').service('auth', AuthService);

  AuthService.$inject = ["$http", '$localStorage', '$rootScope', '$location'];

  function AuthService($http, $localStorage, $rootScope, $location) {

    var api = function (path, data) {
      return $http.post('/api' + path, data);
    };

    return {
      createUser: _createUser,
      loginUser : _loginUser,
      authorized: _authorized,
      logOut: _logOut
    };

    function _createUser(data) {
      if (data) {
        return api('/register', data);
      }
    }

    function _loginUser(data) {
      if (data) {
        return api('/login', data);
      }
    }

    function _authorized() {
      if ($localStorage.token) {
        return api('/authorized', {token: $localStorage.token}).then(function () {
          if ($localStorage.token) {
            $rootScope.isAuthorized = true;
          }
        }).catch(function (err) {
          console.error(err);
          $rootScope.isAuthorized = false;
          $location.path('/');
        });
      } else {
        $rootScope.isAuthorized = false;
        $location.path('/');
      }
    }

    function _logOut() {
      return api('/logout');
    }

  }


})(angular);