import {Component, OnInit} from '@angular/core';
import {AppService} from "../../../../service/app.service";

@Component({
    selector: 'sidebar-component',
    templateUrl: '../../../templates/layout/sidebar/sidebar.template.html',
    styleUrls: ['../../../styles/layout/sidebar/sidebar.component.less']
})
export class SidebarComponent implements OnInit {

    routes: any[] = [];

    constructor(public appService: AppService) {
        this.routes = appService.getRoutes();
    }

    ngOnInit(): void {
    }

}
