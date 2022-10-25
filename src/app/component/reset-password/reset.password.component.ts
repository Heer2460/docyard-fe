import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AppUtility} from '../../util/app.utility';
import {CustomValidations} from '../../util/custom.validations';
import {ApiUrlConstants} from '../../util/api.url.constants';
import {HttpResponse} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {AppService} from '../../service/app.service' ;
import {RequestService} from '../../service/request.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ChangePasswordDTO} from "../../model/settings/um/change.password.dto";

@Component({
    selector: 'login-component',
    templateUrl: './reset.password.template.html',
    styleUrls: [
        './login.css',
        './reset.password.css'
    ]
})
export class ResetPasswordComponent implements OnInit {

    resetPasswordForm: FormGroup = new FormGroup({});
    menus: any = [];

    constructor(
        private formBuilder: FormBuilder,
        public appUtility: AppUtility,
        private requestService: RequestService,
        private toastService: ToastrService,
        public appService: AppService,
        private activatedRoute: ActivatedRoute,
        private router: Router) {
        this.buildForms();
    }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe(params => {
            if (params['token'] || params['userId']) {
                this.requestService.putUnAuthRequest(
                    ApiUrlConstants.UN_AUTH_CHECK_TOKEN_EXPIRY_API_URL + params['token'])
                    .subscribe(
                        (response: HttpResponse<any>) => {
                            if (response.status === 200) {
                                // Nothing to worry
                            } else if (response.status === 203) {
                                this.toastService.error('Link has been expired, please generate again.', 'Reset Password');
                            }
                        },
                        (error: any) => {
                            if (error.status === 404) {
                                this.toastService.error('Invalid Link, please generate again.', 'Reset Password');
                            } else {
                                this.appService.handleError(error, 'Reset Password');
                            }
                        }
                    );
            } else {
                this.router.navigate(['/login']);
            }
        });
    }

    buildForms() {
        this.resetPasswordForm = this.formBuilder.group({
            'passwords': this.formBuilder.group({
                    'password': [null, [
                        Validators.required,
                        Validators.maxLength(32),
                        Validators.pattern(/^.{5,}$/)
                    ]],
                    'confirmPassword': [null, Validators.required],
                },
                {validator: CustomValidations.passwordConfirming}
            )
        });
    }

    resetPassword(data: any) {
        this.activatedRoute.queryParams.subscribe(params => {
            let userId = params['userId'];
            let token = params['token'];
            if (userId) {
                let cp: ChangePasswordDTO= new ChangePasswordDTO() ;
                data.userId = userId;
                data.password = this.appService.encryptUsingAES256(data.passwords.password);
                data.confirmPassword = this.appService.encryptUsingAES256(data.passwords.confirmPassword);
                cp = cp.convertToNewDTO(data);
                cp.token = token;

                this.requestService.putUnAuthRequest(
                    ApiUrlConstants.UN_AUTH_RESET_PASSWORD_API_URL, cp)
                    .subscribe(
                        (response: HttpResponse<any>) => {
                            if (response.status === 200) {
                                this.toastService.success('Your password has been changed.', 'Reset Password');
                                this.router.navigate(['/login']);
                            }
                        },
                        (error: any) => {
                            this.appService.handleError(error, 'Reset Password');
                        }
                    );
            } else {
                this.router.navigate(['/login']);
            }
        });
    }

}
