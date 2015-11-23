(function(angular) {
  "use strict";

  function AuthService($http) {

    var actions = {
      createUser: _createUser
    };

    return actions;

    function _createUser (data) {
      if (data) {
        return $http.post('/api/users/create', data).then(function(res) {
          return res.data;
        }).catch(function(err) {
          return err;
        });
      }
    }

  }

  angular.module('todo').service('auth', AuthService);

  AuthService.$inject = ["$http"];

})(angular);