import {Component, OnInit} from '@angular/core';
import {PrimeNGConfig} from "primeng/api";
import {AppService} from "./service/app.service";
import {AppUtility} from "./util/app.utility";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {

    constructor(private primengConfig: PrimeNGConfig,
                private appService: AppService,
                public appUtility: AppUtility) {

        let menu: any = localStorage.getItem(window.btoa('permissions'));
        this.appService.permissions = JSON.parse(menu);
        this.appUtility.setRoles(this.appService.permissions);

    }

    ngOnInit() {
        this.primengConfig.ripple = true;
    }

}
