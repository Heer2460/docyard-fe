import {Component, Input, OnInit} from '@angular/core';
import {AppService} from "../../../service/app.service";
import {NavigationEnd, Router} from "@angular/router";
import {RoutesDTO} from "../../../model/routes.dto";
import {AppRouteConstants} from "../../../util/app.route.constants";

@Component({
    selector: 'sidebar-component',
    templateUrl: './sidebar.template.html',
    styleUrls: ['./sidebar.component.less']
})
export class SidebarComponent implements OnInit {

    routes: RoutesDTO[] = [];
    currentRoute: string = '';

    constructor(public appService: AppService, private router: Router) {
        router.events.subscribe((route: any) => {
            if(route instanceof NavigationEnd) {
                this.currentRoute = route.url;
                this.switchRouteTypes();
            }
        });
    }

    ngOnInit(): void {
        this.setActiveRoute();
    }

    setActiveRoute() {
        this.setCurrentRoute(null, this.routes, this.currentRoute);
    }

    setCurrentRoute(parent: any = null, routes: any, currentRouteUrl: string) {
        return routes.map((route: any) => {
            if (route.route.indexOf(currentRouteUrl) > -1 ) {
                if(parent) {
                    parent.expended = true;
                }
                route.active = true;
                return route;
            } else if (route?.children?.length > 0) {
                const routes: any = this.setCurrentRoute(route, route.children, currentRouteUrl);
                if (routes) {
                    return routes;
                }
            }
        });
    }

    toggleDropdown(route: any) {
        this.routes.map((route: any) => {
            route.expended = false;
        });
        route.expended = !route.expended;
    }

    switchRouteTypes() {
        this.routes = AppRouteConstants.mainRoutes;
    }

}
