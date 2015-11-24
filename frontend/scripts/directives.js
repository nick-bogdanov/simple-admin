(function (angular) {
  "use strict";

  angular.module('todo').directive('uiNav', uiNav);

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

})(angular);