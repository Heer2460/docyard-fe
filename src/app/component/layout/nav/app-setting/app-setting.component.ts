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

    userInfo: any;
    profileImage = '';
    toggleRightPaneStatus: boolean = false;
    items: MenuItem[] = [];
    @Output() userProfileMenuItemsEvent = new EventEmitter<MenuItem[]>();

    constructor(public appService: AppService, private router: Router) {
        if (this.appService.userInfo) {
            this.userInfo = this.appService.userInfo;
            this.profileImage = this.appService.userInfo.profilePhoto ? this.appService.userInfo.profilePhoto : '';
        }
    }

    ngOnInit(): void {
        this.items = [
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
        this.appService.showRightPaneSubject.subscribe((value: boolean) => {
            this.toggleRightPaneStatus = value;
        });
    }

    setToggleRightPaneState() {
        this.toggleRightPaneStatus = !this.toggleRightPaneStatus;
        this.appService.setRightPaneSubjectState(this.toggleRightPaneStatus);
    }

    addUserProfileMenuItems() {
        this.userProfileMenuItemsEvent.emit(this.items);
    }

    logoutUser() {
        this.appService.logout();
    }

}
