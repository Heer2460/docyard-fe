import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AppService} from "../../../service/app.service";
import {ToastrService} from "ngx-toastr";
import {RequestService} from "../../../service/request.service";
import {ApiUrlConstants} from "../../../util/api.url.constants";
import {HttpResponse} from "@angular/common/http";

@Component({
    selector: 'login-component',
    templateUrl: './login.template.html',
    styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
    
    loginFrom!: FormGroup;
    
    constructor(private fb: FormBuilder,
                private requestsService: RequestService,
                private router: Router,
                private appService: AppService,
                private toastService: ToastrService) {
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
    
    login(data: any) {
        this.router.navigate(['/home']);
        return;
        if (this.loginFrom.invalid) {
            return;
        }
        let url = ApiUrlConstants.OAUTH_TOKEN_API_URL + '?username=' + data.username + '&password=' + data.password + '&grant_type=password';
        this.requestsService.postAccessTokenRequest(url, {})
            .subscribe({
                next: (responseOauth: HttpResponse<any>) => {
                    if (responseOauth.status === 200) {
                        if (responseOauth.body.token_type === 'bearer') {
                            // localStorage.setItem(window.btoa(AppConstants.AUTH_ACCESS_TOKEN), responseOauth.body.access_token);
                            // localStorage.setItem(window.btoa(AppConstants.AUTH_REFRESH_TOKEN), responseOauth.body.refresh_token);
                            // localStorage.setItem(window.btoa(AppConstants.AUTH_EXPIRE_IN), responseOauth.body.expires_in);
                            this.requestsService.postSignInRequest(ApiUrlConstants.SIGN_IN_API_URL, {})
                                .subscribe({
                                    next: (responseLogin: any) => {
                                        if (responseLogin.status === 200) {
                                            
                                            // const userObj = JSON.parse(JSON.stringify(responseLogin.body));
                                            // localStorage.setItem(window.btoa(AppConstants.AUTH_USER_INFO), JSON.stringify(userObj));
                                            // this.appService.userInfo = userObj;
                                            // localStorage.setItem(window.btoa(AppConstants.AUTH_USER_ID), userObj.userId);
                                            //
                                            // this.permissions = responseLogin?.body?.roleDTO?.permissionDTOList;
                                            // localStorage.setItem(window.btoa(AppConstants.AUTH_PERMISSIONS), JSON.stringify(this.permissions));
                                            // this.appService.permissions = this.permissions;
                                            // this.appUtility.setUserActions(this.appService.permissions);
                                            // this.router.navigate(['/main']);
                                        } else {
                                            // localStorage.removeItem(window.btoa(AppConstants.AUTH_ACCESS_TOKEN));
                                            // localStorage.removeItem(window.btoa(AppConstants.AUTH_REFRESH_TOKEN));
                                            // localStorage.removeItem(window.btoa(AppConstants.AUTH_EXPIRE_IN));
                                            // this.router.navigate(['/auth/login']);
                                        }
                                    },
                                    error: (error: any) => {
                                        this.appService.handleError(error, 'Sign In User');
                                    }
                                });
                        } else {
                            // localStorage.removeItem(window.btoa(AppConstants.AUTH_ACCESS_TOKEN));
                            // localStorage.removeItem(window.btoa(AppConstants.AUTH_REFRESH_TOKEN));
                            // localStorage.removeItem(window.btoa(AppConstants.AUTH_EXPIRE_IN));
                            // this.router.navigate(['/auth/login']);
                        }
                    } else {
                        this.toastService.error('Unable to Sign In', 'Sign In User');
                    }
                },
                error: (error: any) => {
                    if (error?.error?.error === 'invalid_grant') {
                        this.toastService.error('Invalid credentials provided, please verify.', 'Sign In User');
                        // this.requestsService.postSignInRequest(ApiUrlConstants.SIGN_IN_API_URL, {})
                        //     .subscribe({
                        //         next: (response: HttpResponse<any>) => {
                        //             localStorage.removeItem(window.btoa(AppConstants.AUTH_ACCESS_TOKEN));
                        //             localStorage.removeItem(window.btoa(AppConstants.AUTH_REFRESH_TOKEN));
                        //             localStorage.removeItem(window.btoa(AppConstants.AUTH_EXPIRE_IN));
                        //             this.router.navigate(['/auth/login']);
                        //             if (response.status === 423) {
                        //                 this.toastService.error('User is locked due to multiple unsuccessful login attempts, please contact administrator.',
                        //                     'Sign In User');
                        //             }
                        //         },
                        //         error: (error: any) => {
                        //             this.appService.handleError(error, 'Sign In User');
                        //         }
                        //     });
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
