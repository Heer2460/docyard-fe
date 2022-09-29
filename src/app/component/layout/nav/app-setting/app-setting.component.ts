import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MenuItem} from "primeng/api";
import {AppService} from "../../../../service/app.service";
import {Router} from "@angular/router";
import {RoleActionConstants} from "../../../../util/role.actions.constants";

@Component({
    selector: 'app-setting-component',
    templateUrl: './app-setting.template.html',
    styleUrls: ['./app-setting.component.less']
})
export class AppSettingComponent implements OnInit {
    
    toggleRightPaneStatus: boolean = false;
    changePasswordDialog: boolean = false;
    items: MenuItem[] = [];
    @Output() userProfileMenuItemsEvent = new EventEmitter<MenuItem[]>();
    
    constructor(public appService: AppService, private router: Router) {
    }
    
    ngOnInit(): void {
        this.items = [
            {
                label: 'Change password',
                icon: 'icon-lock',
                command: () => this.showChangePasswordDialogAction()
            },
            {
                label: 'Profile',
                icon: 'icon-user',
                command: () => this.router.navigate(['/profile'])
            },
            {
                label: 'Logout',
                icon: 'icon-logout',
                command: () => this.logoutUser()
            }
        
        ];
        this.addUserProfileMenuItems();
        this.appService.toggleRightPaneSubject.subscribe((value: boolean) => {
            this.toggleRightPaneStatus = value;
        });
    }
    
    setToggleRightPaneState() {
        this.toggleRightPaneStatus = !this.toggleRightPaneStatus;
        this.appService.setToggleRightPaneSubject(this.toggleRightPaneStatus);
    }
    
    addUserProfileMenuItems() {
        this.userProfileMenuItemsEvent.emit(this.items);
    }
    
    logoutUser() {
        this.appService.logout();
    }
    
    showChangePasswordDialogAction() {
        this.changePasswordDialog = true;
    }
    
    hideChangePasswordDialogAction() {
        this.changePasswordDialog = false;
    }
    
    changePasswordAction() {
    
    }
    
}
