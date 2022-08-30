import {Component, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";

@Component({
    selector: 'user-profile-component',
    templateUrl: '../../../../templates/layout/nav/user-profile/user-profile.template.html',
    styleUrls: ['../../../../styles/layout/nav/user-profile/user-profile.component.less']
})
export class UserProfileComponent implements OnInit {

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
