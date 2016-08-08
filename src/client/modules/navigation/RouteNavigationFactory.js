import {ProfileService} from '../profile/ProfileService';
import {lang} from '../../languages/languages';

const routes = [
    { id: 'dashboard', template: 'dashboard', name: 'Dashboard', pos: 'left', icon: '', log: true, click: '' },
    { id: "scores", template: 'scores', name: 'Scores', pos: 'left', icon: '', log: true, click: '' },
    { id: "about", template: 'about', name: 'About', pos: 'left', icon: '', log: true, click: '' },
    { id: "profile", template: 'profile', name: 'Profile', pos: 'right', icon: 'glyphicon-user', log: true, click: '' },
    { id: "logout",template: '', name: 'Log Out', pos: 'right', icon: 'glyphicon-log-out', log: true, click: 'logOutClick()' },
    { id: "singup", template: 'signup', name: 'Sign Up', pos: 'right', icon: 'glyphicon-plus', log: false, click: '' },
    { id: "Login",template: '', name: 'Log In', pos: 'right', icon: 'glyphicon-log-in', log: false, click: 'logInClick()' }
];


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
