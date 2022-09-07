import {Component, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.less']
})
export class UserComponent implements OnInit {
    
    searchPopupToggle: boolean = false;
    dataRows: any[] = [];
    actionItems: MenuItem[] = [
        {
            label: 'View',
            icon: 'icon-view',
            command: () => {
            }
        }
    ];
    
    constructor() {
    }
    
    ngOnInit(): void {
    }
    
    showSearchPopupAction() {
        this.searchPopupToggle = true;
    }
    
    hideSearchPopupAction() {
        this.searchPopupToggle = false;
    }
    
}
