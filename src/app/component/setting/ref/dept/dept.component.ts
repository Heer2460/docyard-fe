import {Component, OnInit} from '@angular/core';
import {ConfirmationService, MenuItem} from "primeng/api";
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
            command: () => this.onItemDeleteAction()
        }
    ];
    
    constructor(private router: Router, private confirmationService: ConfirmationService) {
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
    
    onItemDeleteAction() {
        this.confirmationService.confirm({
            message: 'Are you sure that you want to perform this action?',
            accept: () => {
                //Actual logic to perform a confirmation
            }
        });
    }
    
}
