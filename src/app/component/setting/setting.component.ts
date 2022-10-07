import {Component, OnInit} from '@angular/core';
import {AppService} from "../../service/app.service";
import {BreadcrumbDTO} from "../../model/breadcrumb.dto";

@Component({
    selector: 'setting-component',
    templateUrl: './setting.template.html',
    styleUrls: ['./setting.component.less']
})
export class SettingComponent implements OnInit {
    
    showDocInfoPane: boolean = true;
    breadcrumbs: BreadcrumbDTO[] = [
        {
            label: 'Home',
            route: '/home',
            active: false
        },
        {
            label: 'Settings',
            route: '/setting',
            active: true
        }
    ];
    
    title: string = 'Settings';
    
    constructor(public appService: AppService) {
    }
    
    ngOnInit(): void {
    }
    
    
}
