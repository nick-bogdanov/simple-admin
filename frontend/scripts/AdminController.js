(function (angular) {
  "use strict";

  angular.module('todo')
    .controller('ServiceListController', ServiceListController)
    .controller('EditServiceController', EditServiceController);

  ServiceListController.$inject = ['$scope', 'AdminServices'];
  EditServiceController.$inject = ['AdminServices', '$route'];

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
          console.log(res);
          if (res.data.success) {
            _this.services.push(res.data.service);
          }
        }).catch(function (err) {
          console.error(err);
        });

      }
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
      console.log(res);
      _this.services = res.data.services;
    }).catch(function (err) {
      console.error(err);
    });

  }

  function EditServiceController(AdminServices, $route) {

    var _this = this;
    this.service = {};

    this.saveServiceSettings = function(data) {
      //skip undefined and empty strings
      data = _.omit(data, function(d) {
        return _.isUndefined(d) || d === '';
      });

      AdminServices.updateSettings(data).then(function(data) {
        console.log(data);
      }).catch(function(err) {
        console.log(err);
      });

    };

    AdminServices.getSettings($route.current.params.id).then(function (res) {
      console.log(res.data);
      _this.service = res.data.extras.services;
    }).catch(function (err) {
      console.error(err);
    });


  }

})(angular);