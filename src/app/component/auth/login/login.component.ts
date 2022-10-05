import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AppService} from "../../../service/app.service";
import {ToastrService} from "ngx-toastr";
import {RequestService} from "../../../service/request.service";
import {ApiUrlConstants} from "../../../util/api.url.constants";
import {HttpResponse} from "@angular/common/http";
import {AppUtility} from "../../../util/app.utility";
import {AppConstants} from "../../../util/app.constants";

@Component({
    selector: 'login-component',
    templateUrl: './login.template.html',
    styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {

    loginFrom!: FormGroup;
    permissions: any[] = [];

    constructor(private fb: FormBuilder,
                private requestsService: RequestService,
                private router: Router,
                private appService: AppService,
                private toastService: ToastrService,
                public appUtility: AppUtility) {
    }

    ngOnInit(): void {
        this.createLoginForm();
    }

    createLoginForm() {
        this.loginFrom = this.fb.group({
            username: [null, Validators.required],
            password: [null, Validators.required]
        });
    }

    forgetPassword() {
        this.router.navigate(['/forgot-password']);
    }

    login(data: any) {
        if (this.loginFrom.invalid) {
            return;
        }
        let url = ApiUrlConstants.OAUTH_TOKEN_API_URL + '?username=' + data.username + '&password=' +  this.appService.encryptUsingAES256(data.password) + '&grant_type=password';
        this.requestsService.postAccessTokenRequest(url, {})
            .subscribe({
                next: (responseOauth: HttpResponse<any>) => {
                    if (responseOauth.status === 200) {
                        if (responseOauth.body.token_type === 'bearer') {
                            localStorage.setItem(window.btoa(AppConstants.AUTH_ACCESS_TOKEN), responseOauth.body.access_token);
                            localStorage.setItem(window.btoa(AppConstants.AUTH_REFRESH_TOKEN), responseOauth.body.refresh_token);
                            localStorage.setItem(window.btoa(AppConstants.AUTH_EXPIRES_IN), responseOauth.body.expires_in);

                            this.requestsService.postSignInRequest(ApiUrlConstants.SIGN_IN_API_URL + '/' + data.username, {})
                                .subscribe({
                                    next: (responseLogin: any) => {
                                        if (responseLogin.status === 200) {
                                            const userObj = JSON.parse(JSON.stringify(responseLogin.body));
                                            localStorage.setItem(window.btoa(AppConstants.AUTH_USER_INFO), JSON.stringify(userObj));
                                            this.appService.userInfo = userObj;
                                            localStorage.setItem(window.btoa(AppConstants.AUTH_USER_ID), userObj.id);

                                            this.permissions = responseLogin?.body?.moduleDTOList;
                                            localStorage.setItem(window.btoa(AppConstants.AUTH_PERMISSIONS), JSON.stringify(this.permissions));
                                            this.appService.permissions = this.permissions;
                                            this.appUtility.setRoles(this.appService.permissions);

                                            this.router.navigate(['/home']);

                                        } else {
                                            localStorage.removeItem(window.btoa(AppConstants.AUTH_ACCESS_TOKEN));
                                            localStorage.removeItem(window.btoa(AppConstants.AUTH_REFRESH_TOKEN));
                                            localStorage.removeItem(window.btoa(AppConstants.AUTH_EXPIRES_IN));
                                            this.router.navigate(['/login']);
                                        }

                                    },
                                    error: (error: any) => {
                                        this.appService.handleError(error, 'Sign In User');
                                    }
                                });
                        } else {
                            localStorage.removeItem(window.btoa(AppConstants.AUTH_ACCESS_TOKEN));
                            localStorage.removeItem(window.btoa(AppConstants.AUTH_REFRESH_TOKEN));
                            localStorage.removeItem(window.btoa(AppConstants.AUTH_EXPIRES_IN));
                            this.router.navigate(['/login']);
                        }
                    } else {
                        this.toastService.error('Unable to Sign In', 'Sign In User');
                    }
                },
                error: (error: any) => {
                    if (error?.error?.error === 'invalid_grant') {
                        this.toastService.error('Invalid credentials provided, please verify.', 'Sign In User');
                    } else {
                        if (error.status === 0 && error?.error instanceof ProgressEvent) {
                            this.toastService.error('Connection Refused, May be server is down.', 'Sign In User');
                        } else {
                            this.toastService.error(error?.error?.error_description, 'Sign In User');
                        }
                    }
                }
            });
    }

}
