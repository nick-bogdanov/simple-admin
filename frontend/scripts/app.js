(function (angular) {
  'use strict';

  angular.module('todo', ['ngRoute', 'ngAnimate', 'ngStorage']).config(function ($routeProvider) {

    $routeProvider
      .when('/login', {
        templateUrl : '/views/login',
        controller  : 'AuthController',
        controllerAs: 'vm'
      })
      .when('/register', {
        templateUrl : '/views/register',
        controller  : 'AuthController',
        controllerAs: 'vm'
      })
      .when('/services-lists', {
        templateUrl : '/views/services-list',
        controller  : 'CreateService',
        controllerAs: 'cs'
      })
      .otherwise({
        redirectTo: '/register'
      });
  }).run(function (auth) {
    auth.authorized();
  });

})(angular);