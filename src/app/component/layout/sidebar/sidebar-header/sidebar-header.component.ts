import {Component, OnInit} from '@angular/core';
import {AppService} from "../../../../service/app.service";

@Component({
    selector: 'sidebar-header-component',
    templateUrl: './sidebar-header.template.html',
    styleUrls: ['./sidebar-header.component.less']
})
export class SidebarHeaderComponent implements OnInit {

    toggleMenuState: boolean = false;

    constructor(public appService: AppService) {
    }

    ngOnInit(): void {
        this.appService.showMenuBSubject.subscribe((value: boolean) => {
            this.toggleMenuState = value;
        });
    }

    setToggleMenuState() {
        this.toggleMenuState = !this.toggleMenuState;
        this.appService.setMenuBarSubjectState(this.toggleMenuState);
    }

}
