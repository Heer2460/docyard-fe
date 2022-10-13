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
    menus: RoutesDTO[] = [];

    constructor(public appService: AppService, private router: Router) {
        router.events.subscribe((route: any) => {
            if (route instanceof NavigationEnd) {
                this.currentRoute = route.url;
                this.switchRouteTypes();
                this.setActiveRoute();
            }
        });
    }

    ngOnInit(): void {
    
    }

    setActiveRoute() {
        this.setCurrentRoute(null, this.routes, this.currentRoute);
    }

    setCurrentRoute(parent: any = null, routes: any, currentRouteUrl: string) {
        return routes.map((route: any) => {

            //False all previous active routes;
            route.active = false;
            route.expended = false;

            //Expending all parents of current child
            if (parent) {

                if (currentRouteUrl.includes(parent.route)) {
                    parent.active = true;
                    parent.expended = true;
                }

            }

            if (route?.children?.length > 0) {
                const routes: any = this.setCurrentRoute(route, route.children, currentRouteUrl);
                if (routes) {
                    return routes;
                }
            } else {

                if (currentRouteUrl.includes(route.route)) {

                    route.active = true;
                    return route;

                }

            }

        });
    }

    toggleDropdownMenu(routes: any, menuItem: any, parent: any = null) {
        routes.map((route: any) => {
            
            if(route.route == menuItem.route) {
                if (parent) {
                    parent.expended = true;
                }
                menuItem.expended = !menuItem.expended;
            }else {
                route.expended = false;
                if(route.children) {
                    this.toggleDropdownMenu(route.children, menuItem, route);
                }
            }
        })
    }

    switchRouteTypes() {
        if (this.appService.permissions.length >= 1) {
            const mappedMenu = this.appService.permissions.map((item: any) => {
                return {
                    label: item.name,
                    route: item.route,
                    icon: item.icon,
                    expended: false,
                    active: false,
                    children: item.children.map((child: any) => {
                        return {
                            label: child.name,
                            route: child.route,
                            icon: child.icon,
                            expended: false,
                            active: false,
                        };
                    }),
                }
            });
            this.routes = [
                ...AppRouteConstants.mainRoutes,
                {
                    label: 'Settings',
                    route: '/setting',
                    icon: 'icon-cog',
                    expended: false,
                    active: false,
                    children: mappedMenu
                }
            ];
        } else {
            this.routes = AppRouteConstants.mainRoutes;
        }

    }

}
