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


    constructor(private router: Router, private confirmationService: ConfirmationService,
                private fb: FormBuilder, private requestsService: RequestService,
                private appService: AppService, public appUtility: AppUtility,
                private toastService: ToastrService) {
    }

    ngOnInit(): void {
        // this.getUsers();
        this.getUserById(8);
        this.buildForms();
        this.getAllGroup()
    }

    getUserById(id: 8) {
        this.requestsService.getRequest(ApiUrlConstants.USER_API_URL + id)
            .subscribe({
                next: (response: HttpResponse<any>) => {
                    if (response.status === 200) {
                        this.selectedUserProfile = response.body.data;
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
            userId: [8],
            currentPassword: [null, [Validators.required, Validators.maxLength(32)]],
            newPassword: [null, [Validators.required, Validators.maxLength(32)]],
            confirmPassword: [null, [Validators.required, Validators.maxLength(32)]],

        });
    }

    changePassword() {
        if (this.changePasswordForm.invalid) {
            return;
        }
        let profileDTO: ProfileDTO = new ProfileDTO();
        profileDTO = profileDTO.convertToNewDTO(this.changePasswordForm.value);
        if (profileDTO) {
            this.requestsService.putRequest(ApiUrlConstants.ChangePassword, profileDTO)
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
    }

    getAllGroup() {

        let url = ApiUrlConstants.GROUP_API_URL
        this.requestsService.getRequest(url)
            .subscribe({
                next: (response: HttpResponse<any>) => {
                    if (response.status === 200) {
                        this.groups = response.body.data;
                    } else {
                        this.groups = [];
                        this.message = 'No group found.';
                    }
                },
                error: (error: any) => {
                    this.appService.handleError(error, 'Group');
                }
            });
    }

}
