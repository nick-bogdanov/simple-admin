(function (angular) {
  "use strict";

  angular.module('todo').controller('CreateService', CreateService);

  CreateService.$inject = ['$scope', 'AdminServices'];

  function CreateService($scope, AdminServices) {

    this.services = [];
    var _this = this;

    this.createService = function (form) {

      if (form) {
        var service = {
          idp  : $scope.idp,
          login: $scope.login
        };

        AdminServices.createService(service).then(function (res) {
          if (res.data.success) {
            _this.services.push(service);
          }
        }).catch(function (err) {
          console.error(err);
        });

      }
    };

    this.editService = function(id) {
      console.log(id);
    };

    this.removeService = function(id) {
      AdminServices.remove
    };

    this.filterParam = function () {
      var param = {};

      if ($scope.action) {
        param[$scope.action.toLowerCase()] = $scope.search;
      }

      return param;
    };

    AdminServices.getServices().then(function(res) {
      console.log(res.data.extras.services);
      _this.services = res.data.extras.services;
    }).catch(function() {
      console.error(err);
    });

  }

})(angular);