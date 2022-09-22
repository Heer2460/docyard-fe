import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {RoutesDTO} from "../model/routes.dto";
import {AppConstants} from "../util/app.constants";

@Injectable({
    providedIn: 'root'
})
export class AppService {
    secretKey: string = 'DOCYARDINFOTECH';
    permissions: any = [];

    public toggleMenuBSubject = new BehaviorSubject(false);
    public toggleRightPaneSubject = new BehaviorSubject(false);
    public toggleDocInfoPaneSubject = new BehaviorSubject(false);
    public isGridDisplaySubject = new BehaviorSubject(false);
    routes: RoutesDTO[] = [];

    constructor(private toastService: ToastrService, private router: Router) {
    }

    setRoutes(routes: RoutesDTO[]) {
        localStorage.removeItem(AppConstants.APP_ROUTES);
        localStorage.setItem(AppConstants.APP_ROUTES, JSON.stringify(routes));
    }

    getRoutes() {
        const routes: any = localStorage.getItem(AppConstants.APP_ROUTES)
        return JSON.parse(routes);
    }

    setToggleMenuBSubject(state: boolean) {
        this.toggleMenuBSubject.next(state);
    }

    setToggleRightPaneSubject(state: boolean) {
        this.toggleRightPaneSubject.next(state);
    }

    setToggleDocInfoPaneSubject(state: boolean) {
        this.toggleDocInfoPaneSubject.next(state);
    }

    setGridDisplaySubject(state: boolean) {
        this.isGridDisplaySubject.next(state);
    }

    handleError(error: any, title: string, fromLogin?: boolean) {
        if (error.status === 400) {
            this.toastService.error(error.error.message, title);
        } else if (error.status === 404) {
            this.toastService.error(error.error.message, title);
        } else if (error.status === 401) {
            this.tokenExpired(error.error.error, fromLogin);
        } else if (error.status === 406) {
            this.tokenExpired(error.error.error, fromLogin);
        } else if (error.status === 409) {
            this.toastService.error(error.error.message, title);
        } else if (error.status === 423) {
            this.toastService.error('User is locked due to multiple unsuccessful login attempts, please contact administrator.', title);
        } else if (error.status === 203) {
            this.toastService.error(error.error.message, title);
        } else {
            this.toastService.error(error.error.message, title);
        }
    }

    tokenExpired(response: string, fromLogout?: boolean) {
        if (response === 'invalid_token') {
            localStorage.removeItem(window.btoa('access_token'));
            localStorage.removeItem(window.btoa('refresh_token'));
            localStorage.removeItem(window.btoa('expire_in'));

            if (fromLogout && !fromLogout) {
                this.toastService.info('Your session has been expired.', 'Session Expired');
            }
            this.router.navigate(['/auth/login']);
        }
    }

    successAddMessage(title: string): void {
        this.toastService.success('Record created successfully.', title);
    }

    successUpdateMessage(title: string): void {
        this.toastService.success('The record updated successfully.', title);
    }

    successDeleteMessage(title: string): void {
        this.toastService.success('Deleted Successfully', title);
    }
    successMessage(message: string): void {
        this.toastService.success('Update Successfully', message);
    }

    encryptUsingAES256(text: any) {
        const textToChars = (text: any) => text.split('').map((c: any) => c.charCodeAt(0));
        const byteHex = (n: any) => ('0' + Number(n).toString(16)).substr(-2);
        const applySaltToChar = (code: any) => textToChars(this.secretKey).reduce((a: any, b: any) => a ^ b, code);
        return text
            .split('')
            .map(textToChars)
            .map(applySaltToChar)
            .map(byteHex)
            .join('');
    }

    decryptUsingAES256(encoded: any) {
        const textToChars = (text: any) => text.split('').map((c: any) => c.charCodeAt(0));
        const applySaltToChar = (code: any) => textToChars(this.secretKey).reduce((a: any, b: any) => a ^ b, code);
        return encoded
            .match(/.{1,2}/g)
            .map((hex: any) => parseInt(hex, 16))
            .map(applySaltToChar)
            .map((charCode: any) => String.fromCharCode(charCode))
            .join('');
    }
}
