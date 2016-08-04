export function navigation(RouteNavigation) {
    return {
        restrict: "E",
        replace: true,
        templateUrl: "navigation/navigation.html",
        controller: ($scope) => {
            $scope.routes = RouteNavigation.routes;
            $scope.activeRoute = RouteNavigation.activeRoute;
        }
    };
}

export function navBarLogged(NavigationConstructor) {
    return {
        template: () => {
            return NavigationConstructor.navBuild(true);
        },
        controller: 'NavigationController'
    };
}

export function navBarNotLogged(NavigationConstructor) {
    return {
        template: () => {
            return NavigationConstructor.navBuild(false);
        },
        controller: 'NavigationController'
    };
}
