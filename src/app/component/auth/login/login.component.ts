import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AppService} from "../../../service/app.service";
import {ToastrService} from "ngx-toastr";
import {RequestService} from "../../../service/request.service";
import {ApiUrlConstants} from "../../../util/api.url.constants";
import {HttpResponse} from "@angular/common/http";
import {AppUtility} from "../../../util/app.utility";

@Component({
    selector: 'login-component',
    templateUrl: './login.template.html',
    styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {

    loginFrom!: FormGroup;
    permissions :any[] = [
        {
            "id": null,
            "createdOn": "2022-09-21T10:51:41+05:00",
            "updatedOn": "2022-09-16T16:53:31+05:00",
            "createdBy": null,
            "updatedBy": null,
            "moduleId": 2,
            "name": "User Managment",
            "slug": "user",
            "route": "/setting/um",
            "icon": "icon-user-mgmt",
            "seq": 2,
            "status": "Active",
            "catSlug": null,
            "catName": null,
            "children": [
                {
                    "id": null,
                    "createdOn": "2022-09-21T10:49:46+05:00",
                    "updatedOn": "2022-09-16T16:54:09+05:00",
                    "createdBy": null,
                    "updatedBy": null,
                    "moduleId": 3,
                    "name": "Users",
                    "slug": "user",
                    "route": "/setting/um/user",
                    "icon": "icon-users",
                    "seq": 1,
                    "status": "Active",
                    "catSlug": null,
                    "catName": null,
                    "children": null,
                    "moduleActionDTOList": [
                        {
                            "id": null,
                            "createdOn": "2022-09-16T17:05:36+05:00",
                            "updatedOn": null,
                            "createdBy": null,
                            "updatedBy": null,
                            "moduleActionId": 1,
                            "title": "Add",
                            "slug": "USER_ADD",
                            "seq": 1,
                            "moduleDTO": null
                        },
                        {
                            "id": null,
                            "createdOn": "2022-09-16T17:05:36+05:00",
                            "updatedOn": null,
                            "createdBy": null,
                            "updatedBy": null,
                            "moduleActionId": 2,
                            "title": "View",
                            "slug": "USER_VIEW",
                            "seq": 2,
                            "moduleDTO": null
                        },
                        {
                            "id": null,
                            "createdOn": "2022-09-16T17:05:36+05:00",
                            "updatedOn": null,
                            "createdBy": null,
                            "updatedBy": null,
                            "moduleActionId": 3,
                            "title": "Edit",
                            "slug": "USER_EDIT",
                            "seq": 3,
                            "moduleDTO": null
                        },
                        {
                            "id": null,
                            "createdOn": "2022-09-16T17:05:36+05:00",
                            "updatedOn": null,
                            "createdBy": null,
                            "updatedBy": null,
                            "moduleActionId": 4,
                            "title": "Delete",
                            "slug": "USER_DEL",
                            "seq": 4,
                            "moduleDTO": null
                        },
                        {
                            "id": null,
                            "createdOn": "2022-09-21T11:02:10+05:00",
                            "updatedOn": null,
                            "createdBy": null,
                            "updatedBy": null,
                            "moduleActionId": 24,
                            "title": "Unlock",
                            "slug": "USER_UNLOCK",
                            "seq": 5,
                            "moduleDTO": null
                        }
                    ]
                },
                {
                    "id": null,
                    "createdOn": "2022-09-21T10:50:01+05:00",
                    "updatedOn": "2022-09-16T16:55:03+05:00",
                    "createdBy": null,
                    "updatedBy": null,
                    "moduleId": 4,
                    "name": "Roles",
                    "slug": "role",
                    "route": "/setting/um/role",
                    "icon": "icon-role",
                    "seq": 2,
                    "status": "Active",
                    "catSlug": null,
                    "catName": null,
                    "children": null,
                    "moduleActionDTOList": [
                        {
                            "id": null,
                            "createdOn": "2022-09-16T17:37:31+05:00",
                            "updatedOn": null,
                            "createdBy": null,
                            "updatedBy": null,
                            "moduleActionId": 7,
                            "title": "Add",
                            "slug": "ROLE_ADD",
                            "seq": 1,
                            "moduleDTO": null
                        },
                        {
                            "id": null,
                            "createdOn": "2022-09-16T17:37:31+05:00",
                            "updatedOn": null,
                            "createdBy": null,
                            "updatedBy": null,
                            "moduleActionId": 8,
                            "title": "View",
                            "slug": "ROLE_VIEW",
                            "seq": 2,
                            "moduleDTO": null
                        },
                        {
                            "id": null,
                            "createdOn": "2022-09-16T17:37:31+05:00",
                            "updatedOn": null,
                            "createdBy": null,
                            "updatedBy": null,
                            "moduleActionId": 9,
                            "title": "Edit",
                            "slug": "ROLE_EDIT",
                            "seq": 3,
                            "moduleDTO": null
                        },
                        {
                            "id": null,
                            "createdOn": "2022-09-16T17:37:31+05:00",
                            "updatedOn": null,
                            "createdBy": null,
                            "updatedBy": null,
                            "moduleActionId": 10,
                            "title": "Delete",
                            "slug": "ROLE_DEL",
                            "seq": 4,
                            "moduleDTO": null
                        }
                    ]
                },
                {
                    "id": null,
                    "createdOn": "2022-09-21T10:50:11+05:00",
                    "updatedOn": "2022-09-16T16:55:26+05:00",
                    "createdBy": null,
                    "updatedBy": null,
                    "moduleId": 5,
                    "name": "Groups",
                    "slug": "group",
                    "route": "/setting/um/group",
                    "icon": "icon-group",
                    "seq": 3,
                    "status": "Active",
                    "catSlug": null,
                    "catName": null,
                    "children": null,
                    "moduleActionDTOList": [
                        {
                            "id": null,
                            "createdOn": "2022-09-16T17:39:27+05:00",
                            "updatedOn": null,
                            "createdBy": null,
                            "updatedBy": null,
                            "moduleActionId": 11,
                            "title": "Add",
                            "slug": "GROUP_ADD",
                            "seq": 1,
                            "moduleDTO": null
                        },
                        {
                            "id": null,
                            "createdOn": "2022-09-16T17:40:21+05:00",
                            "updatedOn": null,
                            "createdBy": null,
                            "updatedBy": null,
                            "moduleActionId": 13,
                            "title": "View",
                            "slug": "GROUP_VIEW",
                            "seq": 2,
                            "moduleDTO": null
                        },
                        {
                            "id": null,
                            "createdOn": "2022-09-16T17:40:21+05:00",
                            "updatedOn": null,
                            "createdBy": null,
                            "updatedBy": null,
                            "moduleActionId": 14,
                            "title": "Edit",
                            "slug": "GROUP_EDIT",
                            "seq": 3,
                            "moduleDTO": null
                        },
                        {
                            "id": null,
                            "createdOn": "2022-09-16T17:40:21+05:00",
                            "updatedOn": null,
                            "createdBy": null,
                            "updatedBy": null,
                            "moduleActionId": 15,
                            "title": "Delete",
                            "slug": "GROUP_DEL",
                            "seq": 4,
                            "moduleDTO": null
                        }
                    ]
                }
            ],
            "moduleActionDTOList": []
        },
        {
            "id": null,
            "createdOn": "2022-09-21T10:51:25+05:00",
            "updatedOn": "2022-09-16T17:02:21+05:00",
            "createdBy": null,
            "updatedBy": null,
            "moduleId": 7,
            "name": "References",
            "slug": "reference",
            "route": "/setting/ref",
            "icon": "icon-reference",
            "seq": 3,
            "status": "Active",
            "catSlug": null,
            "catName": null,
            "children": [
                {
                    "id": null,
                    "createdOn": "2022-09-21T10:50:28+05:00",
                    "updatedOn": "2022-09-16T17:03:36+05:00",
                    "createdBy": null,
                    "updatedBy": null,
                    "moduleId": 8,
                    "name": "Departments",
                    "slug": "department",
                    "route": "/setting/ref/department",
                    "icon": "icon-department",
                    "seq": 1,
                    "status": "Active",
                    "catSlug": null,
                    "catName": null,
                    "children": null,
                    "moduleActionDTOList": [
                        {
                            "id": null,
                            "createdOn": "2022-09-16T17:43:12+05:00",
                            "updatedOn": null,
                            "createdBy": null,
                            "updatedBy": null,
                            "moduleActionId": 19,
                            "title": "Add",
                            "slug": "DEPT_ADD",
                            "seq": 1,
                            "moduleDTO": null
                        },
                        {
                            "id": null,
                            "createdOn": "2022-09-16T17:43:12+05:00",
                            "updatedOn": null,
                            "createdBy": null,
                            "updatedBy": null,
                            "moduleActionId": 20,
                            "title": "View",
                            "slug": "DEPT_VIEW",
                            "seq": 2,
                            "moduleDTO": null
                        },
                        {
                            "id": null,
                            "createdOn": "2022-09-16T17:43:12+05:00",
                            "updatedOn": null,
                            "createdBy": null,
                            "updatedBy": null,
                            "moduleActionId": 21,
                            "title": "Edit",
                            "slug": "DEPT_EDIT",
                            "seq": 3,
                            "moduleDTO": null
                        },
                        {
                            "id": null,
                            "createdOn": "2022-09-16T17:43:12+05:00",
                            "updatedOn": null,
                            "createdBy": null,
                            "updatedBy": null,
                            "moduleActionId": 22,
                            "title": "Delete",
                            "slug": "DEPT_DEL",
                            "seq": 4,
                            "moduleDTO": null
                        }
                    ]
                }
            ],
            "moduleActionDTOList": []
        }
    ];

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

    forgetPassword(){
        this.router.navigate(['/forgot-password']);
    }

    login(data: any) {

        localStorage.setItem(window.btoa('permissions'), JSON.stringify(this.permissions));
        this.appService.permissions = this.permissions;
        this.appUtility.setRoles(this.appService.permissions);
        this.router.navigate(['/home']);

        /*
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
            });*/
    }

}
