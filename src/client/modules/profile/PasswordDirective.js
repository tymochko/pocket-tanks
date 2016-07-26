import angular from 'angular';
export function match ($parse) {
    return {
        require: '?ngModel',
        restrict: 'A',
        link: (scope, elem, attrs, ctrl) => {
            if(!ctrl || !attrs.match) {
                return;
            }

            let matchGetter = $parse(attrs.match);
            let noMatchGetter = $parse(attrs.notMatch);

            scope.$watch(getMatchValue, () => {
                ctrl.$$parseAndValidate();
            });

            ctrl.$validators.match = (modelValue, viewValue) => {
                let matcher = modelValue || viewValue;
                let match = getMatchValue();
                let notMatch = noMatchGetter(scope);
                let value;
                    value = matcher === match;
                value ^= notMatch;
                return !!value;
            };

            function getMatchValue(){
                let match = matchGetter(scope);
                if(angular.isObject(match) && match.hasOwnProperty('$viewValue')){
                    match = match.$viewValue;
                }
                return match;
            }
        }
    };
}