import {Component, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";

@Component({
    selector: 'dashboard-component',
    templateUrl: '../../templates/home/home.template.html',
    styleUrls: ['../../styles/home/home.component.less']
})
export class HomeComponent implements OnInit {
    
    items: MenuItem[] = [];
    
    constructor() {
    }

    ngOnInit(): void {
        this.items = [
            {
                label: 'Setting 1',
                icon: 'icon-cog',
                command: () => {}
            },
            {separator:true},
            {
                label: 'Setting 2',
                icon: 'icon-cog',
                command: () => {}
            }
        ];
    }

}
