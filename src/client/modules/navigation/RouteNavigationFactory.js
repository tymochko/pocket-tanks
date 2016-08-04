export function RouteNavigation($route, $location) {
    const routes = [
        { template: 'dashboard', name: 'Dashboard', pos: 'left', icon: '', log: true, click: '' },
        { template: 'scores', name: 'Scores', pos: 'left', icon: '', log: true, click: '' },
        { template: 'about', name: 'About', pos: 'left', icon: '', log: true, click: '' },
        { template: 'profile', name: 'Profile', pos: 'right', icon: 'glyphicon-user', log: true, click: '' },
        { template: '', name: 'Log Out', pos: 'right', icon: 'glyphicon-log-out', log: true, click: 'logOutClick()' },
        { template: 'signup', name: 'Sign Up', pos: 'right', icon: 'glyphicon-plus', log: false, click: '' },
        { template: '', name: 'Log In', pos: 'right', icon: 'glyphicon-log-in', log: false, click: 'logInClick()' }
    ];

    return {
        routes,
        activeRoute: (route) => {
            return route.path === $location.path();
        }
    };
}
