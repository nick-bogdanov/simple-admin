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
        controller  : 'ServicesController',
        controllerAs: 'sc'
      })
      .otherwise({
        redirectTo: '/register'
      });
  }).run(function ($location, auth, $localStorage, $rootScope) {
    if ($localStorage.token) {
      auth.authorized($localStorage.token).then(function(res) {
        console.log('Authorized');
        $rootScope.isAuthorized = true;
      }).catch(function(err) {
        console.log(err);
        $rootScope.isAuthorized = false;
        $location.path('/');
      });
    }else{
      $rootScope.isAuthorized = false;
      $location.path('/');
    }
  });

})(angular);