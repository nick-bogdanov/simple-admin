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
      removeService: _remove,
      getSettings  : _getSettings,
      updateSettings  : _update
    };

    function _create(data) {
      return api('/create-service', {data: data});
    }

    function _getServices() {
      return api('/get-services');
    }

    function _remove(id) {
      return api('/removeService', {id: id});
    }

    function _getSettings(serviceId) {
      return api('/get-settings', {serviceId: serviceId});
    }

    function _update(data) {
      return api('/update-settings', {data: data});
    }



  }

})(angular);