import {Component, OnInit} from '@angular/core';
import {ApiUrlConstants} from "../../util/api.url.constants";
import {HttpResponse} from "@angular/common/http";
import {RequestService} from "../../service/request.service";
import {AppService} from "../../service/app.service";
import {UserDTO} from "../../model/settings/um/user/user.dto";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {ConfirmationService} from "primeng/api";
import {AppUtility} from "../../util/app.utility";
import {ToastrService} from "ngx-toastr";
import {GroupDTO} from "../../model/settings/um/group/group.dto";
import {CustomValidations} from "../../util/custom.validations";
import {AppConstants} from "../../util/app.constants";
import {BreadcrumbDTO} from "../../model/breadcrumb.dto";


@Component({
    selector: 'user-profile-component',
    templateUrl: './user-profile.template.html',
    styleUrls: ['./user-profile.component.less']
})
export class UserProfileComponent implements OnInit {

    changePasswordForm: FormGroup = new FormGroup({});
    selectedUserProfile: UserDTO = new UserDTO();
    groups: GroupDTO[] = [];
    message: string = 'Click search to get user Profile.';
    visibleChangePasswordDialog: boolean = false;
    files: any[] = [];
    url = '';
    profileImage: any = null;
    userId = localStorage.getItem(window.btoa(AppConstants.AUTH_USER_ID));
    activityLogs: any[] = [];
    currPasswordVisibility: boolean = true;
    newPasswordVisibility: boolean = true;
    confirmPasswordVisibility: boolean = true;
    breadcrumbs: BreadcrumbDTO[] = [
        {
            label: 'Home',
            route: '/home',
            active: false
        },
        {
            label: 'Profile',
            route: '/profile',
            active: true
        }
    ];
    title: string = 'Profile';

    constructor(private router: Router,
                private confirmationService: ConfirmationService,
                private fb: FormBuilder,
                private requestsService: RequestService,
                private appService: AppService,
                public appUtility: AppUtility,
                private toastService: ToastrService) {
    }

    ngOnInit(): void {
        this.getUserById(this.userId);
        this.getActivityLogsByUser(this.userId);
        this.buildForms();
    }


    toggleCurrPasswordVisibility() {
        this.currPasswordVisibility = !this.currPasswordVisibility;
    }

    toggleNewPasswordVisibility() {
        this.newPasswordVisibility = !this.newPasswordVisibility;
    }

    toggleConfirmPasswordVisibility() {
        this.confirmPasswordVisibility = !this.confirmPasswordVisibility;
    }

    getUserById(id: any) {
        this.requestsService.getRequest(ApiUrlConstants.USER_API_URL + id)
            .subscribe({
                next: (response: HttpResponse<any>) => {
                    if (response.status === 200) {
                        this.selectedUserProfile = response.body.data;
                        if (this.selectedUserProfile.profilePhoto) {
                            this.profileImage = this.selectedUserProfile?.profilePhoto;
                        }
                    }
                }, error: (error: any) => {
                    this.appService.handleError(error, 'User Profile');
                }
            });
    }

    getActivityLogsByUser(id: any) {
        this.requestsService.getRequest(ApiUrlConstants.USER_ACTIVITY_LOGS_API_URL.replace("{userId}", id))
            .subscribe({
                next: (response: HttpResponse<any>) => {
                    if (response.status === 200) {
                        this.activityLogs = response.body.data;
                    }
                }, error: (error: any) => {
                    this.appService.handleError(error, 'User Activity');
                }
            });
    }

    showChangePasswordPopup() {
        this.changePasswordForm.patchValue({
            currentPassword: '',
            passwords: {
                password: '',
                confirmPassword: ''
            }
        });
        this.changePasswordForm.markAsUntouched();
        this.visibleChangePasswordDialog = true;
    }

    hideChangePasswordPopup() {
        this.changePasswordForm.patchValue({
            currentPassword: '',
            passwords: {
                password: '',
                confirmPassword: ''
            }
        });
        this.changePasswordForm.markAsUntouched();
        this.visibleChangePasswordDialog = false;
    }

    buildForms() {
        this.changePasswordForm = this.fb.group({
            userId: [this.userId],
            profilePicture: [''],
            currentPassword: [null, [Validators.required, Validators.maxLength(32)]],
            passwords: this.fb.group({
                password: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(32), Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,32}$/)]],
                confirmPassword: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(32), Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,32}$/)]],
            }, {validators: CustomValidations.passwordConfirming}),

        });
    }

    changePassword() {
        let data = {
            userId: this.userId,
            currentPassword: this.appService.encryptUsingAES256(this.changePasswordForm.value.currentPassword),
            newPassword: this.appService.encryptUsingAES256(this.changePasswordForm.value.passwords.password)
        };
        this.requestsService.putRequest(ApiUrlConstants.CHANGE_PASSWORD_API_URL, data)
            .subscribe({
                next: (response: HttpResponse<any>) => {
                    if (response.status === 200) {
                        this.toastService.success(response.body.message, 'Change Password');
                        this.hideChangePasswordPopup();
                    }
                },
                error: (error: any) => {
                    this.appService.handleError(error, 'Change Password');
                }
            });
    }

    updateProfileImg(event: any) {
        let format;
        let size;
        if (event.target.files.length > 0) {
            size = event.target.files[0].size / 1024 / 1024;
            if (size > 2) {
                this.toastService.error('Uploaded file size is not supported.', 'Profile Picture');
                return;
            }
            format = event.target.files[0].type;
            if (!format.includes('image/')) {
                this.toastService.error('Uploaded file type is not supported.', 'Profile Picture');
                return;
            }
            let data = {
                id: this.userId,
            };
            let obj = {
                type: 'profilePicture',
                data: event.target.files[0]
            };
            this.files.push(obj);
            let reader = new FileReader();
            reader.onload = this.handleReaderLoadedProfileImage.bind(this);
            this.profileImage = reader.readAsBinaryString(obj.data);
            this.requestsService.putRequestMultipartFormAndData(ApiUrlConstants.UPLOAD_IMAGE_API_URL, this.files, data)
                .subscribe({
                    next: (response: HttpResponse<any>) => {
                        if (response.status === 200) {
                            this.appService.successMessage('Change Profile Picture');
                        }
                    }, error: (error: any) => {
                        this.appService.handleError(error, 'Change Profile Picture');
                    }
                });
        }
    }

    handleReaderLoadedProfileImage(readerEvt: any) {
        let binaryString = readerEvt.target.result;
        this.profileImage = window.btoa(binaryString);
    }
}
