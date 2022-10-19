import {Component, Input, OnInit} from '@angular/core';
import {AppService} from "../../../service/app.service";
import {MenuItem} from "primeng/api";

@Component({
    selector: 'nav-component',
    templateUrl: './nav.template.html',
    styleUrls: ['./nav.component.less']
})
export class NavComponent implements OnInit {

    showMenuBSubject: boolean = false;
    showRightPane: boolean = false;

    @Input() showImageViewSettings: boolean = false;

    constructor(public appService: AppService) {
    }

    ngOnInit(): void {
        this.appService.showMenuBSubject.subscribe((value: boolean) => {
            this.showMenuBSubject = value;
        });
        this.appService.showRightPaneSubject.subscribe((value: boolean) => {
            this.showRightPane = value;
        });
    }

    setToggleMenuState() {
        this.showMenuBSubject = !this.showMenuBSubject;
        this.appService.setMenuBarSubjectState(this.showMenuBSubject);
    }

    setRightPaneState() {
        this.appService.setRightPaneSubjectState(!this.showRightPane);
    }

}
