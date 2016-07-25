import angular from 'angular';

export const equals = function() {
  return {
    restrict: 'A', 
    require: '?ngModel', 
    link: function(scope, elem, attrs, ngModel) {
      if(!ngModel) return; 
      scope.$watch(attrs.ngModel, function() {
        validate();
      });
      attrs.$observe('equals', function (val) {
        validate();
      });
      var validate = function() {
        let val1 = ngModel.$viewValue;
        let val2 = attrs.equals;
        ngModel.$setValidity('equals', ! val1 || ! val2 || val1 === val2);
      };
    }
  }
}
