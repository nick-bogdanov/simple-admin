(function(angular) {
  'use strict';

  angular.module('todo', ['ngRoute', 'ngAnimate']).config(function($routeProvider) {

    $routeProvider
      .when('/login', {
        templateUrl: '/views/login',
        controller: 'AuthController',
        controllerAs: 'vm'
      })
      .when('/register', {
        templateUrl: '/views/register',
        controller: 'AuthController',
        controllerAs: 'vm'
      })
      .otherwise({
        redirectTo: '/user/register'
      });
  });

})(angular);