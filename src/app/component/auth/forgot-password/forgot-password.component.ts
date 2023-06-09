import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AppService} from "../../../service/app.service";
import {ToastrService} from "ngx-toastr";
import {RequestService} from "../../../service/request.service";
import {ApiUrlConstants} from "../../../util/api.url.constants";
import {HttpResponse} from "@angular/common/http";
import {AppUtility} from "../../../util/app.utility";
import {environment} from "../../../../environments/environment";
import {Router} from "@angular/router";

@Component({
    selector: 'forgot-password-component',
    templateUrl: './forgot-password.template.html',
    styleUrls: ['./forgot-password.component.less']
})
export class ForgotPasswordComponent implements OnInit {

    forgotPasswordForm: FormGroup = new FormGroup({});

    constructor(private toastService: ToastrService,
                private fb: FormBuilder,
                private router: Router,
                public appService: AppService, public appUtility: AppUtility,
                private requestsService: RequestService) {

    }

    ngOnInit() {
        this.buildForms();
    }

    buildForms() {
        this.forgotPasswordForm = this.fb.group({
            email: [null, [Validators.required, Validators.maxLength(50)]],
        });
    }

    forgotPassword(data1: any) {

        let url = ApiUrlConstants.FORGOT_PASSWORD_API_URL + '?email=' + data1.email
        this.requestsService.putRequest(url)
            .subscribe(
                (response: HttpResponse<any>) => {
                    if (response.status === 200) {
                        this.router.navigate(['/login']);
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
