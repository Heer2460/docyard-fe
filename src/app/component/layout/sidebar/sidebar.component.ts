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

    @Input() routes: RoutesDTO[] = [];
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
        switch (this.currentRoute) {
            case '/home':
                this.setCurrentRoute(null, this.routes, '/home');
                break;
            case '/doc-lib':
                this.setCurrentRoute(null, this.routes, '/doc-lib');
                break;
            case '/setting/um/user':
                this.setCurrentRoute(null, this.routes, '/setting/um/user');
                break;
            case '/setting/um/user/add':
                this.setCurrentRoute(null, this.routes, '/setting/um/user');
                break;
            case '/setting/ref/dept':
                this.setCurrentRoute(null, this.routes, '/setting/ref/dept');
                break;
            case '/setting/ref':
                this.setCurrentRoute(null, this.routes, '/setting/ref');
                break;
            case '/setting/ref/dept/add':
                this.setCurrentRoute(null, this.routes, '/setting/ref/dept');
                break;
            case '/setting/um/role/add':
                this.setCurrentRoute(null, this.routes, '/setting/um/role');
                break;
            default:
                if (this.currentRoute.indexOf('/setting/ref/dept/edit') > -1) {
                    this.setCurrentRoute(null, this.routes, '/setting/ref/dept');
                }
                break;
        }
    }
    
    setCurrentRoute(parent: any = null, routes: any, currentRouteUrl: string) {
        return routes.map((route: any) => {
            if (route.route == currentRouteUrl) {
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
        if (this.router.url.split('/')[1] == 'setting') {
            this.appService.setRoutes(AppRouteConstants.settingRoutes);
        } else {
            this.appService.setRoutes(AppRouteConstants.mainRoutes);
        }
        this.routes = this.appService.getRoutes();
    }

}
