export class NavigationConstructor {
    constructor(RouteNavigation) {
        this.navBuild = (logged) => {
            let href;
            let name;
            let ngClick = "";
            let icon = "";
            const activeGameId = RouteNavigation.activeData.active;
            let nav = '<ul class="nav navbar-nav"> ';
            let navRight = '<ul class="nav navbar-nav navbar-right"> ';
            let navCenter = '';

            if(activeGameId){
                 navCenter = '<button ng-click="test()" class="btn btn-danger navbar-center">Resume GAME</button>';
            }
            if (logged) {
                for (let i = 0; i < RouteNavigation.routes.length; i++) {
                    href = ' href="' + RouteNavigation.routes[i].template + '"';
                    name = RouteNavigation.routes[i].name;

                    if (RouteNavigation.routes[i].click !== "") {
                        ngClick = ' ng-click="' + RouteNavigation.routes[i].click + '"';
                    }

                    if (RouteNavigation.routes[i].icon !== "") {
                        icon = '<span class="glyphicon ' + RouteNavigation.routes[i].icon + '"></span> ';
                    }

                    if (RouteNavigation.routes[i].log) { //check its working accuracy
                        if (RouteNavigation.routes[i].pos === 'left') {
                            nav += ' <li><a' + href + ngClick + '>' + name + '</a></li> ';
                        } else if (RouteNavigation.routes[i].pos === 'right') {
                            navRight += ' <li><a' + href + ngClick + '>' + icon + name + '</a></li>';
                        }
                    }
                }
                nav += '</ul> ';
                navRight += '</ul>';

                return nav + navCenter + navRight;
            }

            for (let i = 0; i < RouteNavigation.routes.length; i++) {
                href = ' href="' + RouteNavigation.routes[i].template + '"';
                name = RouteNavigation.routes[i].name;

                if (RouteNavigation.routes[i].click !== "") {
                    ngClick = ' ng-click="' + RouteNavigation.routes[i].click + '"';
                }

                if (RouteNavigation.routes[i].icon !== "") {
                    icon = '<span class="glyphicon ' + RouteNavigation.routes[i].icon + '"></span> ';
                }

                if (RouteNavigation.routes[i].pos === 'right' && !RouteNavigation.routes[i].log) {
                    navRight += ' <li><a' + href + ngClick + '>' + icon + name + '</a></li>';
                }
            }
            return navRight;
        };
        this.activeGameData = () => {
            const activeGamesId = RouteNavigation.activeData.active;
            return activeGamesId
        }
    }
}
