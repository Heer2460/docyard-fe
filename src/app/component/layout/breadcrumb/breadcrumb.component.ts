import {Component, Input, OnInit} from '@angular/core';
import {AppService} from "../../../service/app.service";
import {NavigationEnd, Router} from "@angular/router";
import {RoutesDTO} from "../../../model/routes.dto";

@Component({
    selector: 'breadcrumb-component',
    templateUrl: './breadcrumb.component.html',
    styleUrls: ['./breadcrumb.component.less']
})
export class BreadcrumbComponent implements OnInit {
    
    title: string = '';
    description: string = '';
    breadcrumbs: any[] = [];
    currentRouteUrl: string = '';
    titleAndDescOnly: boolean = false;
    isGridDisplay: boolean = false;
    
    routes: RoutesDTO[] = [];
    @Input() showDisplayButtons: boolean = false;
    
    constructor(public appService: AppService, private router: Router) {
        router.events.subscribe((route: any) => {
            if (route instanceof NavigationEnd) {
                this.routes = appService.getRoutes();
                this.currentRouteUrl = this.router.url;
                this.getCurrentBreadcrumb(null, this.routes);
                this.getPageTitle();
            }
        });
        
    }
    
    ngOnInit(): void {
    }
    
    getCurrentBreadcrumb(parent: any = null, routes: RoutesDTO[]) {
        return routes.filter((route: any) => {
            if (route.route == '/home') {
                this.breadcrumbs.push(route);
                return route;
            } else if (route.route == this.currentRouteUrl) {
                if(parent) {
                    parent.active = true;
                    this.breadcrumbs.push(parent);
                }
                this.breadcrumbs.push(route);
                route.active = true;
                return route;
            } else if (route?.children?.length > 0) {
                const routes: any = this.getCurrentBreadcrumb(route, route.children);
                if (routes) {
                    return routes;
                }
            }
        });
    }
    
    getPageTitle() {
        const mainRoute: string[] = this.currentRouteUrl.split('/');
        if (mainRoute[1] == 'home') {
            this.title = 'Home';
            this.description = 'Hello Umar, Welcome back!';
            this.titleAndDescOnly = true;
        } else if (mainRoute[1] == 'doc-lib') {
            this.title = 'Document Library';
        } else if (mainRoute[1] == 'setting') {
            if(mainRoute.length > 2) {
                this.breadcrumbs.splice(1, 0, {
                    route: '/setting',
                    active: false,
                    label: 'Setting'
                })
            }
            
            if (mainRoute[2] == 'user') {
                this.title = 'User';
            } else {
                this.title = 'Setting';
                this.breadcrumbs.splice(1, 0, {
                    route: '/setting',
                    active: true,
                    label: 'Setting'
                })
            }
        }
        
    }
    
    setGridDisplay() {
        this.isGridDisplay = true;
        this.appService.setGridDisplaySubject(this.isGridDisplay);
    }
    
    setListDisplay() {
        this.isGridDisplay = false;
        this.appService.setGridDisplaySubject(this.isGridDisplay);
    }
    
}
