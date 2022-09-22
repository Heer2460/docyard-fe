import {Component, OnInit} from '@angular/core';
import {ApiUrlConstants} from "../../util/api.url.constants";
import {HttpResponse} from "@angular/common/http";
import {RequestService} from "../../service/request.service";
import {ProfileDTO} from "../../model/settings/profile/profile.dto";
import {AppService} from "../../service/app.service";
import {UserDTO} from "../../model/settings/um/user/user.dto";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {ConfirmationService} from "primeng/api";
import {AppUtility} from "../../util/app.utility";
import {ToastrService} from "ngx-toastr";
import {RoleDTO} from "../../model/settings/um/role/role.dto";
import {GroupDTO} from "../../model/settings/um/group/group.dto";
import {CustomValidations} from "../../util/custom.validations";


@Component({
    selector: 'user-profile-component',
    templateUrl: './user-profile.template.html',
    styleUrls: ['./user-profile.component.less']
})
export class UserProfileComponent implements OnInit {

    changePasswordForm: FormGroup = new FormGroup({});
    userProfile: ProfileDTO[] = [];
    selectedUserProfile: UserDTO = new UserDTO();
    groups: GroupDTO[] = [];
    selectedGroups: GroupDTO = new GroupDTO;
    message: string = 'Click search to get user Profile.';
    visibleChangePasswordDialog: boolean = false;
    files: any[] = [];
    url = '';
    profileImage: any = null;
    profilePicture: any;


    constructor(private router: Router,
                private confirmationService: ConfirmationService,
                private fb: FormBuilder,
                private requestsService: RequestService,
                private appService: AppService,
                public appUtility: AppUtility,private toastService: ToastrService) {
    }

    ngOnInit(): void {
        this.getUserById(10);
        this.buildForms();
    }

    getUserById(id: 10) {
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
                    this.appService.handleError(error, 'User');
                }
            });
    }

    showChangePasswordPopup() {
        this.changePasswordForm.patchValue({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        });
        this.changePasswordForm.markAsUntouched();
        this.visibleChangePasswordDialog = true;
    }

    hideChangePasswordPopup() {
        this.changePasswordForm.patchValue({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        });
        this.changePasswordForm.markAsUntouched();
        this.visibleChangePasswordDialog = false;
    }


    buildForms() {
        this.changePasswordForm = this.fb.group({
            userId: [10],
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
            userId: 10,
            currentPassword: this.appService.encryptUsingAES256(this.changePasswordForm.value.currentPassword),
            newPassword: this.appService.encryptUsingAES256(this.changePasswordForm.value.passwords.password)
        };
        this.requestsService.putRequest(ApiUrlConstants.CHANGE_PASSWORD_API_URL, data)
            .subscribe({
                next: (response: HttpResponse<any>) => {
                    if (response.status === 200) {
                        this.appService.successAddMessage('Group');
                        this.hideChangePasswordPopup();
                    }
                },
                error: (error: any) => {
                    this.appService.handleError(error, 'Group');
                }
            });
    }

    updateProfileImg(event: any) {
        if (event.target.files.length > 0) {
            let data = {
                id: 10,
            };
            let obj = {
                type: 'profilePicture',
                data: event.target.files[0]
            };
            this.files.push(obj);
            let reader = new FileReader();
            reader.onload = this.handleReaderLoadedProfileImage.bind(this);
            this.profileImage = reader.readAsBinaryString(obj.data);
            console.log(this.profileImage);
            this.requestsService.putRequestMultipartFormAndData(ApiUrlConstants.UPLOAD_IMAGE_API_URL, this.files, data)
                .subscribe({
                    next: (response: HttpResponse<any>) => {
                        if (response.status === 200) {
                            this.appService.successMessage('Image');
                            // this.toastService.error('Image update successfully.');
                        }
                    }, error: (error: any) => {
                        this.appService.handleError(error, 'User');
                    }
                });
        }
    }

    handleReaderLoadedProfileImage(readerEvt: any) {
        let binaryString = readerEvt.target.result;
        this.profileImage = window.btoa(binaryString);
    }
}
