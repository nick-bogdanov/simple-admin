(function (angular) {

  angular.module('todo')
    .service('AdminServices', AdminServices);

  AdminServices.$inject = ['$http'];

  function AdminServices($http) {

    var api = function (path, data) {
      return $http.post('/api/services' + path, data);
    };

    return {
      createService: _create,
      getServices  : _getServices,
      removeService: _remove
    };

    function _create(data) {
      return api('/create', data);
    }

    function _getServices() {
      return api('/get-services');
    }

    function _remove(id) {
      return api('/removeServive', {id: id});
    }

  }

})(angular);