(function (angular) {
  "use strict";

  function AuthService($http) {

    var api = function (path, data, handler) {
      return $http.post('/api' + path, data).then(handler);
    };

    return {
      createUser: _createUser,
      loginUser : _loginUser
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

  }

  angular.module('todo').service('auth', AuthService);

  AuthService.$inject = ["$http"];

})(angular);