(function (angular) {
  "use strict";

  angular.module('todo')
    .service('auth', AuthService)
    .service('injectTokenService', TokenService);

  AuthService.$inject  = ["$http", '$rootScope', '$location'];
  TokenService.$inject = ['$localStorage'];

  function AuthService($http, $rootScope, $location) {

    var api = function (path, data) {
      return $http.post('/api' + path, data);
    };

    return {
      createUser: _createUser,
      loginUser : _loginUser,
      authorized: _authorized,
      logOut    : _logOut
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

      $rootScope.$on('$routeChangeStart', function (event, next) {
        api('/authorized').then(function (res) {
          var authorized = $rootScope.isAuthorized = res.data.authorized;

          if (authorized) {
            $location.path(next.originalUrl);
          } else {
            if (next.templateUrl === '/views/register' || next.templateUrl === '/views/login') {
              $location.path(next.originalUrl);
            } else {
              $location.path('/login');
            }
          }

        }).catch(function (err) {
          console.log(err);
        });

      });

    }

    function _logOut() {
      return api('/logout');
    }

  }

  function TokenService($localStorage) {
    return {
      'request': function (config) {
        config.headers.token = $localStorage.token;
        return config;
      }
    };
  }


})(angular);