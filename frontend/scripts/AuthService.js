(function (angular) {
  "use strict";

  function AuthService($http) {

    var api = function (path, data) {
      return $http.post('/api' + path, data);
    };

    return {
      createUser: _createUser,
      loginUser : _loginUser,
      authorized: _authorized

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

    function _authorized(token) {
      if (token) {
        return api('/authorized', {token: token});
      }
    }

  }

  angular.module('todo')
    .service('auth', AuthService);

  AuthService.$inject = ["$http"];


})(angular);