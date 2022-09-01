import {Component, OnInit} from '@angular/core';
import {AppService} from "../../../../service/app.service";
import {NavigationEnd, Router} from "@angular/router";

@Component({
    selector: 'sidebar-component',
    templateUrl: '../../../templates/layout/sidebar/sidebar.template.html',
    styleUrls: ['../../../styles/layout/sidebar/sidebar.component.less']
})
export class SidebarComponent implements OnInit {

    routes: any[] = [];
    currentRoute: string = '';
    
    constructor(public appService: AppService, private router: Router) {
        this.routes = appService.getRoutes();
        router.events.subscribe((route: any) => {
            if(route instanceof NavigationEnd) {
                this.currentRoute = route.url;
            }
        });
    }

    ngOnInit(): void {
    }

}
