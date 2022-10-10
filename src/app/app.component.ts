import {Component, OnInit} from '@angular/core';
import {PrimeNGConfig} from "primeng/api";
import {AppService} from "./service/app.service";
import {AppUtility} from "./util/app.utility";
import {environment} from "../environments/environment";
import {getMessaging, getToken} from "firebase/messaging";
import {AppConstants} from "./util/app.constants";

@Component({
    selector: 'app-component',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {

    constructor(private primengConfig: PrimeNGConfig,
                private appService: AppService,
                public appUtility: AppUtility) {

        let userObj: any = localStorage.getItem(window.btoa(AppConstants.AUTH_USER_INFO));
        this.appService.userInfo = JSON.parse(userObj);

        let menu: any = localStorage.getItem(window.btoa(AppConstants.AUTH_PERMISSIONS));
        this.appService.permissions = JSON.parse(menu);
        this.appUtility.setRoles(this.appService.permissions);

    }

    ngOnInit() {
        this.primengConfig.ripple = true;
        this.requestPermission();
    }

    requestPermission() {
        const messaging = getMessaging();
        getToken(messaging,
            {vapidKey: environment.firebase.vapidKey}).then(
            (currentToken) => {
                if (currentToken) {
                    //console.log(currentToken);
                } else {
                    //console.log('No registration token available. Request permission to generate one.');
                }
            }).catch((err) => {
        });
    }


}
