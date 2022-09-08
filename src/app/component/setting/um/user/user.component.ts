import {Component, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.less']
})
export class UserComponent implements OnInit {
    
    searchPopupToggle: boolean = false;
    dataRows: any[] = [
        {
            name: 'Umar farooq',
            username: 'umar',
            address: 'street #01, johar town'
        }
    ];
    actionItems: MenuItem[] = [
        {
            label: 'View',
            icon: 'icon-eye',
            command: () => {
            }
        },
        {
            label: 'Edit',
            icon: 'icon-edit',
            command: () => {
            }
        },
        {
            label: 'Delete',
            icon: 'icon-trash',
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
