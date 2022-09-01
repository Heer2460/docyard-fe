import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MenuItem} from "primeng/api";
import {AppService} from "../../../../../service/app.service";

@Component({
    selector: 'user-profile-component',
    templateUrl: '../../../../templates/layout/nav/user-profile/user-profile.template.html',
    styleUrls: ['../../../../styles/layout/nav/user-profile/user-profile.component.less']
})
export class UserProfileComponent implements OnInit {
    
    toggleRightPaneStatus: boolean = false;
    items: MenuItem[] = [];
    @Output() userProfileMenuItemsEvent = new EventEmitter<MenuItem[]>();
    
    constructor(public appService: AppService) {
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

}
