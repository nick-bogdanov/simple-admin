(function (angular) {
  "use strict";

  angular.module('todo').controller('ServiceListController', ServiceListController);

  ServiceListController.$inject = ['$scope', 'AdminServices'];

  function ServiceListController($scope, AdminServices) {

    this.services = [];
    var _this     = this;

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

    this.editService = function (id) {
      console.log(id);
    };

    this.removeService = function (id) {
      AdminServices.removeService(id).then(function (result) {

        if (result.data.success) {

          _this.services = _.remove(_this.services, function (n) {
            return n._id !== id;
          });

        }

      }).catch(function (err) {
        console.err(err);
      });
    };

    this.filterParam = function () {
      var param;

      if ($scope.action) {
        param                              = {};
        param[$scope.action.toLowerCase()] = $scope.search;
      } else {
        param = $scope.search;
      }

      return param;

    };

    AdminServices.getServices().then(function (res) {
      console.log(res.data.extras.services);
      _this.services = res.data.extras.services;
    }).catch(function () {
      console.error(err);
    });

  }

})(angular);