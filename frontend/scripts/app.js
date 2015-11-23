(function(angular) {
  'use strict';

  angular.module('todo', ['ngRoute', 'ngMdIcons', 'ngMaterial', 'ngAnimate']).config(function($routeProvider) {

    $routeProvider
      .when('/login', {
        templateUrl: '/views/login',
        controller: 'AuthController'
      })
      .when('/user/register', {
        templateUrl: '/views/register',
        controller: 'AuthController',
        controllerAs: 'vm'
      })
      .otherwise({
        redirectTo: '/user/register'
      });
  });

})(angular);