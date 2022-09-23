import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AppService} from "../../../service/app.service";
import {ToastrService} from "ngx-toastr";
import {RequestService} from "../../../service/request.service";
import {ApiUrlConstants} from "../../../util/api.url.constants";
import {HttpResponse} from "@angular/common/http";
import {AppUtility} from "../../../util/app.utility";
import {UserDTO} from "../../../model/settings/um/user/user.dto";

@Component({
    selector: 'forgot-password-component',
    templateUrl: './forgot-password.template.html',
    styleUrls: ['./forgot-password.component.less']
})
export class ForgotPasswordComponent implements OnInit {

    forgotPasswordForm: FormGroup = new FormGroup({});

    constructor(
        private toastService: ToastrService,
        private fb: FormBuilder,
        public appService: AppService, public appUtility: AppUtility,
        private requestsService: RequestService,
        ) {

    }

    ngOnInit() {
        this.buildForms();
    }

    buildForms() {


        this.forgotPasswordForm = this.fb.group({
            email: [null, [Validators.required, Validators.maxLength(50)]],
        });
    }

    // forgotPassword(data: any) {
    //     if (this.forgotPasswordForm.invalid) {
    //         return;
    //     }
    //     let data1 = {
    //         userId: 10,
    //         passwordResetLink:'http://localhost:4200/reset-password'
    //     }
    //     if (data) {
    //         this.requestsService.putRequest(ApiUrlConstants.FORGOT_PASSWORD_API_URL, data1)
    //             .subscribe({
    //                 next: (response: HttpResponse<any>) => {
    //                     if (response.status === 200) {
    //                         this.appService.successUpdateMessage('Group');
    //
    //                     }
    //                 },
    //                 error: (error: any) => {
    //                     this.appService.handleError(error, 'Group');
    //                 }
    //             });
    //     }
    // }

    forgotPassword(data1: any) {
        let data ={
            passwordResetLink:'http://localhost:4200/reset-password'
        }
        let url = ApiUrlConstants.FORGOT_PASSWORD_API_URL + '?email=' + data1.email
        this.requestsService.putRequest(url,data)
            .subscribe(
                (response: HttpResponse<any>) => {
                    if (response.status === 200) {
                        this.toastService.success('Email has been sent, please reset your password.', 'Forgot Password');
                    } else {
                        this.toastService.error('The provided email is not registered in the system.', 'Forgot Password');
                    }
                },
                (error: any) => {
                    this.toastService.error('The provided email is not registered in the system.', 'Forgot Password');
                }
            );
    }

}
