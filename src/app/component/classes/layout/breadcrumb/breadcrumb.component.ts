import {Component, Input, OnInit} from '@angular/core';
import {AppService} from "../../../../service/app.service";
import {Router} from "@angular/router";

@Component({
    selector: 'breadcrumb-component',
    templateUrl: '../../../templates/layout/breadcrumb/breadcrumb.component.html',
    styleUrls: ['../../../styles/layout/breadcrumb/breadcrumb.component.less']
})
export class BreadcrumbComponent implements OnInit {
    
    title: string = '';
    description: string = '';
    breadcrumbs: any[] = [];
    currentRouteUrl: string = '';
    titleAndDescOnly: boolean = false;
    isGridDisplay: boolean = false;
    
    constructor(public appService: AppService, private router: Router) {
        this.currentRouteUrl = this.router.url;
    }
    
    ngOnInit(): void {
        this.getPageTitle();
    }
    
    getCurrentBreadcrumb() {
        this.breadcrumbs = this.appService.getRoutes().filter((route: any) => {
            if (route.route == '/home') {
                return route;
            }
            if (route.route == this.currentRouteUrl) {
                return route;
            }
        });
    }
    
    getPageTitle() {
        switch (this.currentRouteUrl) {
            case '/home':
                this.title = 'Home';
                this.description = 'Hello Umar, Welcome back!';
                this.titleAndDescOnly = true;
                break;
            case '/doc-lib':
                this.title = 'Document Library';
                this.getCurrentBreadcrumb();
                break;
        }
    }
    
}
