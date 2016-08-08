import {ProfileService} from '../profile/ProfileService';

const routes = [
    { id: 'dashboard', template: 'dashboard', name: 'Dashboard', pos: 'left', icon: '', log: true, click: '' },
    { id: "", template: 'scores', name: 'Scores', pos: 'left', icon: '', log: true, click: '' },
    { template: 'about', name: 'About', pos: 'left', icon: '', log: true, click: '' },
    { template: 'profile', name: 'Profile', pos: 'right', icon: 'glyphicon-user', log: true, click: '' },
    { template: '', name: 'Log Out', pos: 'right', icon: 'glyphicon-log-out', log: true, click: 'logOutClick()' },
    { template: 'signup', name: 'Sign Up', pos: 'right', icon: 'glyphicon-plus', log: false, click: '' },
    { template: '', name: 'Log In', pos: 'right', icon: 'glyphicon-log-in', log: false, click: 'logInClick()' }
];

const lang = {
    "ukr": {
        "dashboard": "Користувачі"
    }
};

const getNewNames = (routes, key) => {
    return routes.map((route) => {
        const langMap = lang[key];
        if (langMap && langMap[route.id]) {
            return Object.assign({}, route, { name: langMap[route.id] });
        }

        return route;
    });
};

export function RouteNavigation($route, $location, ProfileService) {

    return {
        routes,
        activeRoute: (route) => {
            return route.path === $location.path();
        },
        getNewRoutes: () => {
            return ProfileService.getProfile().then(({data}) => {
                return getNewNames(routes, data.userLanguage);
            });
        }
    };
}
