import {Component, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";
import {Router} from "@angular/router";

@Component({
    selector: 'app-user',
    templateUrl: './dept.component.html',
    styleUrls: ['./dept.component.less']
})
export class DeptComponent implements OnInit {
    
    searchPopupToggle: boolean = false;
    viewPopupToggle: boolean = false;
    dataRows: any[] = [
        {
            name: 'Department sample name',
            address: 'Sample address'
        }
    ];
    actionItems: MenuItem[] = [
        {
            label: 'View',
            icon: 'icon-eye',
            command: () => this.showViewPopupAction()
        },
        {
            label: 'Edit',
            icon: 'icon-edit',
            command: () => this.router.navigate(['/setting/ref/dept/edit'])
        },
        {
            label: 'Delete',
            icon: 'icon-trash',
            command: () => {
            }
        }
    ];
    
    constructor(private router: Router) {
    }
    
    ngOnInit(): void {
    }
    
    showSearchPopupAction() {
        this.searchPopupToggle = true;
    }
    
    hideSearchPopupAction() {
        this.searchPopupToggle = false;
    }
    
    showViewPopupAction() {
        this.viewPopupToggle = true;
    }
    
    hideViewPopupAction() {
        this.viewPopupToggle = false;
    }
    
}
