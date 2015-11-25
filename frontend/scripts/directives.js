(function (angular) {
  "use strict";

  angular.module('todo')
    .directive('uiNav', uiNav)
    .directive('logOut', logOut);

  logOut.$inject = ['$localStorage', '$location', 'auth', '$rootScope'];

  function uiNav() {
    return function (scope, elem, attrs) {
      scope.$on('$routeChangeStart', function (next, current) {

        if (attrs.uiNav === current.originalPath) {
          elem.addClass('active');
        } else {
          elem.removeClass('active');
        }
      });
    };
  }

  function logOut($localStorage, $location, auth, $rootScope) {
    return function(scope, elem) {
      elem.bind('click', function(e) {
        e.preventDefault();
        if ($localStorage.token) {
          auth.logOut();
          $rootScope.isAuthorized = false;
          $localStorage.$reset();
          $location.path('/login');
        }
      });
    };
  }

})(angular);