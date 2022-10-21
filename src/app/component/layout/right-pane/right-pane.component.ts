import {Component, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";

@Component({
    selector: 'right-pane-component',
    templateUrl: './right-pane.template.html',
    styleUrls: ['./right-pane.component.less']
})
export class RightPaneComponent implements OnInit {

    userProfileMenuItems: MenuItem[] = [];

    constructor() {
    }

    ngOnInit(): void {
    }

    getUserProfileMenuItems(menuItems: MenuItem[]) {
        this.userProfileMenuItems = menuItems;
    }

}
