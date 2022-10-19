import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {RoutesDTO} from "../model/routes.dto";
import {RoleActionConstants} from "../util/role.actions.constants";
import {AppConstants} from "../util/app.constants";

@Injectable({
    providedIn: 'root'
})
export class AppService {
    secretKey: string = 'DOCYARDINFOTECH';
    permissions: any = [];
    userInfo: any;

    public showMenuBSubject = new BehaviorSubject(false);
    public showRightPaneSubject = new BehaviorSubject(false);
    public showDocInfoPaneSubject = new BehaviorSubject(false);

    routes: RoutesDTO[] = [];

    constructor(private toastService: ToastrService,
                private router: Router) {
    }

    setMenuBarSubjectState(state: boolean) {
        this.showMenuBSubject.next(state);
    }

    setRightPaneSubjectState(state: boolean) {
        this.showRightPaneSubject.next(state);
    }

    setShowDocInfoPaneSubjectState(state: boolean) {
        this.showDocInfoPaneSubject.next(state);
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
        this.toastService.success('The record has been deleted successfully', title);
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

    noRightsMessage(): void {
        this.toastService.info('You do not have permission.', 'Permission');
    }

    public logout() {
        RoleActionConstants.resetPermission();
        localStorage.clear();
        this.router.navigate(['/login']);
    }


    // check permissions
    hasUserPermissions() {
        return (
            RoleActionConstants.USER_ADD.value || RoleActionConstants.USER_EDIT.value ||
            RoleActionConstants.USER_VIEW.value || RoleActionConstants.USER_DEL.value
        );
    }

    hasGroupPermissions() {
        return (
            RoleActionConstants.GROUP_ADD.value || RoleActionConstants.GROUP_EDIT.value ||
            RoleActionConstants.GROUP_VIEW.value || RoleActionConstants.GROUP_DEL.value
        );
    }

    hasRolePermissions() {
        return (
            RoleActionConstants.ROLE_ADD.value || RoleActionConstants.ROLE_EDIT.value ||
            RoleActionConstants.ROLE_VIEW.value || RoleActionConstants.ROLE_DEL.value
        );
    }

    hasDepartmentPermissions() {
        return (
            RoleActionConstants.DEPT_ADD.value || RoleActionConstants.DEPT_EDIT.value ||
            RoleActionConstants.DEPT_VIEW.value || RoleActionConstants.DEPT_DEL.value
        );
    }

    public getSelectedFolderId(): any {
        const selectedFolderId: number = Number(localStorage.getItem(window.btoa(AppConstants.SELECTED_FOLDER_ID)));
        if (selectedFolderId) {
            return selectedFolderId;
        } else {
            return 0;
        }
    }

    public getLoggedInUserId(): number {
        return Number.parseInt(localStorage.getItem(window.btoa('loggedInUserId')) + '');
    }

    public getFileNameExtracted(text: any) {
        let count = 50;
        return text.slice(0, count) + (text.length > count ? " ... " : "");
    }
}
