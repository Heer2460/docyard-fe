import {Component, Input, OnInit} from '@angular/core';
import {AppService} from "../../../service/app.service";
import {NavigationEnd, Router} from "@angular/router";
import {RoutesDTO} from "../../../model/routes.dto";

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
            }
        });
    }

    ngOnInit(): void {
    }
    
    toggleDropdown(route: any) {
        route.active = !route.active;
    }

}
