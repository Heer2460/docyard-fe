import {Component, Input, OnInit} from '@angular/core';
import {AppService} from "../../service/app.service";
import {RoutesDTO} from "../../model/routes.dto";
import {AppConstants} from "../../util/app.constants";
import {NavigationEnd, NavigationStart, Router} from "@angular/router";

@Component({
    selector: 'layout-component',
    templateUrl: './layout.template.html',
    styleUrls: ['./layout.component.less']
})
export class LayoutComponent implements OnInit {
    
    toggleMenuState: boolean = false;
    toggleRightPaneState: boolean = false;
    docInfoPane: boolean = false;
    
    routes: RoutesDTO[] = [];
    @Input() showDisplayButtons: boolean = false;
    currentRouteUrl: string = '';
    
    constructor(public appService: AppService, private router: Router) {
        router.events.subscribe((route: any) => {
            if(route instanceof NavigationEnd) {
                this.currentRouteUrl = this.router.url;
                if(this.router.url.split('/')[1] == 'setting') {
                    appService.setRoutes(this.appService.settingRoutes);
                }else {
                    appService.setRoutes(this.appService.appRoutes);
                }
                this.routes = appService.getRoutes();
                const route = this.setActiveRoute(null, this.routes);
            }
        });
        
    }
    
    ngOnInit(): void {
        this.appService.toggleMenuBSubject.subscribe((value: boolean) => {
            this.toggleMenuState = value;
        });
        
        this.appService.toggleRightPaneSubject.subscribe((value: boolean) => {
            this.toggleRightPaneState = value;
        });
        
        this.appService.toggleDocInfoPaneSubject.subscribe((value: boolean) => {
            this.docInfoPane = value;
        });
    }
    
    setActiveRoute(parent: any = null, routes: any) {
        return routes.map((route: any) => {
            if (route.route == '/home') {
                return route;
            } else if (route.route == this.currentRouteUrl) {
                if(parent) {
                    parent.active = true;
                }
                route.active = true;
                return route;
            } else if (route?.children?.length > 0) {
                const routes: any = this.setActiveRoute(route, route.children);
                if (routes) {
                    return routes;
                }
            }
        });
    }
    
}
