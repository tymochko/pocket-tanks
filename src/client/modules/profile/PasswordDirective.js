import angular from "angular";
export function match($parse) {
    return {
        require: "?ngModel",
        restrict: "A",
        link: (scope, elem, attrs, ctrl) => {
            if (!ctrl || !attrs.match) {
                return;
            }

            var matchGetter = $parse(attrs.match);
            var noMatchGetter = $parse(attrs.notMatch);

            scope.$watch(getMatchValue, function () {
                ctrl.$$parseAndValidate();
            });

            ctrl.$validators.match =function (modelValue, viewValue) {
                var matcher = modelValue || viewValue;
                var match = getMatchValue();
                var notMatch = noMatchGetter(scope);
                var value;
                    value = matcher === match;
                value ^= notMatch;
                return !!value;
            };

            function getMatchValue(){
                var match = matchGetter(scope);
                if (angular.isObject(match) && match.hasOwnProperty("$viewValue")) {
                    match = match.$viewValue;
                }
                return match;
            }
        }
    };
}