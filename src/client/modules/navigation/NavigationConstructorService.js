export class NavigationConstructor {
    constructor(RouteNavigation) {
        this.navBuild = (logged) => {
            let ngClick = "";
            let icon = "";

            let nav = '<ul class="nav navbar-nav"> ';
            let navRight = '<ul class="nav navbar-nav navbar-right"> ';
            const navCenter = '<a href="/game" class="btn btn-danger navbar-center">Start GAME</a>';

            if (logged) {
                for (const route of RouteNavigation.routes) {
                    if (route.click !== "") {
                        ngClick = `ng-click="${route.click}"`;
                    }

                    if (route.icon !== "") {
                        icon = `<span class="glyphicon ${route.icon}"></span>`;
                    }

                    if (route.log && route.pos === 'left') {
                        nav += `<li><a href="${route.template}" ${ngClick}>${route.name}</a></li>`;
                    } else if (route.log &&route.pos === 'right') {
                        navRight += `<li><a href="${route.template}" ${ngClick}> ${icon} ${route.name}</a></li>`;
                    }
                }
                return nav.concat('</ul>') + navCenter + navRight.concat('</ul>');
            }

            for (const route of RouteNavigation.routes) {
                if (route.click !== "") {
                    ngClick = `ng-click="${route.click}"`;
                }

                if (route.icon !== "") {
                    icon = `<span class="glyphicon ${route.icon}"></span>`;
                }

                if (route.pos === 'right' && !route.log) {
                    navRight += `<li><a href="${route.template}" ${ngClick}>${icon} ${route.name}</a></li>`;
                }
            }
            return navRight;
        };
    }
}
