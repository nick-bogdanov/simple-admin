(function (angular) {

  angular.module('todo')
    .service('AdminServices', AdminServices);

  AdminServices.$inject = ['$http', '$localStorage'];

  function AdminServices($http, $localStorage) {

    var api = function (path, data) {
      return $http.post('/api/services' + path, data);
    };

    return {
      createService: _create,
      getServices  : _getServices,
      removeService: _remove
    };

    function _create(data) {
      data.token = $localStorage.token;
      return api('/create', data);
    }

    function _getServices() {
      return api('/get-services', {token: $localStorage.token});
    }

    function _remove() {
      return api('/removeServive', {token: $localStorage.token});
    }

  }

})(angular);