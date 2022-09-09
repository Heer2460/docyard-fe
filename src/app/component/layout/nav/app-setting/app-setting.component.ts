import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MenuItem} from "primeng/api";
import {AppService} from "../../../../service/app.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-setting-component',
    templateUrl: './app-setting.template.html',
    styleUrls: ['./app-setting.component.less']
})
export class AppSettingComponent implements OnInit {
    
    toggleRightPaneStatus: boolean = false;
    items: MenuItem[] = [];
    @Output() userProfileMenuItemsEvent = new EventEmitter<MenuItem[]>();
    
    constructor(public appService: AppService, private router: Router) {
    }
    
    ngOnInit(): void {
        this.items = [
            {
                label: 'Settings',
                icon: 'icon-cog',
                command: () => this.router.navigate(['setting/um/user'])
            },
            {separator: true},
            {
                label: 'Profile',
                icon: 'icon-user',
                command: () => {
                }
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
        this.router.navigate(['/login']);
    }
    
}
