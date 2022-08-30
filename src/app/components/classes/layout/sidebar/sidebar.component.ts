import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'sidebar-component',
    templateUrl: '../../../templates/layout/sidebar/sidebar.template.html',
    styleUrls: ['../../../styles/layout/sidebar/sidebar.component.less']
})
export class SidebarComponent implements OnInit {

    routes: any[] = [
        {
            label: 'Home',
            route: '/dashboard',
            icon: 'icon-home',
            active: true
        },
        {
            label: 'Document Library',
            route: '/document-library',
            icon: 'icon-cloud',
            active: false
        },
        {
            label: 'Shared by Me',
            route: '/shared-by-me',
            icon: 'icon-shared-by-me',
            active: false
        },
        {
            label: 'Shared with Me',
            route: '/shared-with-me',
            icon: 'icon-shared-with-me',
            active: false
        },
        {
            label: 'Favourite',
            route: '/favourite',
            icon: 'icon-star',
            active: false
        },
        {
            label: 'Trash',
            route: '/trash',
            icon: 'icon-trash',
            active: false
        },
    ];

    constructor() {
    }

    ngOnInit(): void {
    }

}
