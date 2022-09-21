import {Component, OnInit} from '@angular/core';
import {ConfirmationService, MenuItem} from "primeng/api";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ReferencesStatuses} from "../../../../util/references.statuses";
import {Router} from "@angular/router";
import {RequestService} from "../../../../service/request.service";
import {AppService} from "../../../../service/app.service";
import {AppUtility} from "../../../../util/app.utility";
import {ApiUrlConstants} from "../../../../util/api.url.constants";
import {HttpResponse} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";
import {forkJoin, Subject, takeUntil} from "rxjs";
import {GroupDTO} from "../../../../model/settings/um/group/group.dto";
import {UserDTO} from "../../../../model/settings/um/user/user.dto";
import {CustomValidations} from "../../../../util/custom.validations";

@Component({
    selector: 'user-component',
    templateUrl: './user.template.html',
    styleUrls: ['./user.component.less']
})
export class UserComponent implements OnInit {

    searchUserForm: FormGroup = new FormGroup({});
    resetPasswordForm: FormGroup = new FormGroup({});
    searchPopupToggle: boolean = false;
    resetPasswordDialog: boolean = false;
    users: UserDTO[] = [];
    groups: GroupDTO[] = [];
    departments: any[] = [];
    selectedUser: any;
    destroy: Subject<boolean> = new Subject();
    message: string = 'Click search to get users.';
    actionItems: MenuItem[] = [
        {
            label: 'View',
            icon: 'icon-eye',
            command: () => this.onViewOptionSelected(this.selectedUser)
        },
        {
            label: 'Edit',
            icon: 'icon-edit',
            command: () => this.onEditOptionSelected(this.selectedUser)
        },
        {
            label: 'Reset Password',
            icon: 'icon-edit',
            command: () => this.showResetPasswordDialogAction(this.selectedUser)
        },
        {
            label: 'Delete',
            icon: 'icon-trash',
            command: () => this.onItemDeleteAction(this.selectedUser)
        }
    ];
    statuses = ReferencesStatuses.userSearchStatuses;

    constructor(private fb: FormBuilder, private router: Router,
                private confirmationService: ConfirmationService,
                private requestsService: RequestService,
                private appService: AppService,
                public appUtility: AppUtility,
                private toastService: ToastrService) {
    }

    ngOnInit(): void {
        this.preloadedData();
        this.buildForms();
    }

    preloadedData(): void {
        const groups = this.requestsService.getRequest(ApiUrlConstants.GROUP_API_URL + '?status=Active');
        const departments = this.requestsService.getRequest(ApiUrlConstants.DEPARTMENT_API_URL + '?status=Active');
        forkJoin([groups, departments])
            .pipe(takeUntil(this.destroy))
            .subscribe(
                {
                    next: (response: HttpResponse<any>[]) => {
                        if (response[0].status === 200) {
                            this.groups = response[0].body.data;
                        }
                        if (response[1].status === 200) {
                            this.departments = response[1].body.data;
                        }
                    },
                    error: (error: any) => {
                        this.appService.handleError(error, 'User');
                    }
                });
    }

    buildForms() {
        this.searchUserForm = this.fb.group({
            username: [null],
            name: [null],
            group: [null],
            department: [null],
            status: ['Active'],
        });

        this.resetPasswordForm = this.fb.group({
            passwords: this.fb.group({
                password: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(32), Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,32}$/)]],
                confirmPassword: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(32), Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,32}$/)]],
            }, {validators: CustomValidations.passwordConfirming}),
            // groupId: [null, Validators.required],
            // departmentIds: ['']
        });
    }

    searchUsers() {
        let url = ApiUrlConstants.USER_API_URL + 'search' + '?username=' + this.searchUserForm.value.username +
            '&name=' + this.searchUserForm.value.name + '&group=' + this.searchUserForm.value.group +
            '&department=' + this.searchUserForm.value.department + '&status=' + this.searchUserForm.value.status;
        this.requestsService.getRequest(url)
            .subscribe({
                next: (response: HttpResponse<any>) => {
                    if (response.status === 200) {
                        this.users = response.body.data;
                    } else {
                        this.users = [];
                        this.message = 'No user found.'
                    }
                    this.hideSearchPopupAction();
                },
                error: (error: any) => {
                    this.appService.handleError(error, 'User');
                }
            });
    }

    showSearchPopupAction() {
        this.searchPopupToggle = true;
    }

    hideSearchPopupAction() {
        this.searchPopupToggle = false;
    }

    onMenuClicked(data: any) {
        this.selectedUser = data;
        if (this.selectedUser.status === 'Locked') {
            this.actionItems = [
                {
                    label: 'View',
                    icon: 'icon-eye',
                    command: () => this.onViewOptionSelected(this.selectedUser)
                },
                {
                    label: 'Edit',
                    icon: 'icon-edit',
                    command: () => this.onEditOptionSelected(this.selectedUser)
                },
                {
                    label: 'Unlock',
                    icon: 'icon-lock',
                    command: () => this.onUnlockUserAction(this.selectedUser)
                },
                {
                    label: 'Reset Password',
                    icon: 'icon-edit',
                    command: () => this.showResetPasswordDialogAction(this.selectedUser)
                },
                {
                    label: 'Delete',
                    icon: 'icon-trash',
                    command: () => this.onItemDeleteAction(this.selectedUser)
                }
            ];
        } else {
            this.actionItems = [
                {
                    label: 'View',
                    icon: 'icon-eye',
                    command: () => this.onViewOptionSelected(this.selectedUser)
                },
                {
                    label: 'Edit',
                    icon: 'icon-edit',
                    command: () => this.onEditOptionSelected(this.selectedUser)
                },
                {
                    label: 'Reset Password',
                    icon: 'icon-edit',
                    command: () => this.showResetPasswordDialogAction(this.selectedUser)
                },
                {
                    label: 'Delete',
                    icon: 'icon-trash',
                    command: () => this.onItemDeleteAction(this.selectedUser)
                }
            ];
        }
    }

    onViewOptionSelected(data: any) {
        this.router.navigate(['/setting/um/user/view/' + data.id]);
    }

    onEditOptionSelected(data: any) {
        this.router.navigate(['/setting/um/user/edit/' + data.id]);
    }

    onItemDeleteAction(data: any) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete this record?',
            accept: () => {
                //Actual logic to perform a confirmation
                this.deleteUser(data.id)
            }
        });
    }

    deleteUser(id: any) {
        if (id) {
            this.requestsService.deleteRequest(ApiUrlConstants.USER_API_URL + id).subscribe({
                next: (response: HttpResponse<any>) => {
                    if (response.status == 200) {
                        this.appService.successDeleteMessage('User');
                        this.searchUsers();
                    }
                },
                error: (error: any) => {
                    this.appService.handleError(error, 'User');
                }
            });
        } else {
            this.toastService.error('Select Item', 'User');
        }
    }

    showResetPasswordDialogAction(selectedUser: UserDTO) {
        this.resetPasswordForm.patchValue({
            passwords: {
                password: '',
                confirmPassword: ''
            }
        });
        this.resetPasswordForm.markAsUntouched();
        this.resetPasswordDialog = true;
    }

    hideResetPasswordDialogAction() {
        this.resetPasswordDialog = false;
    }

    onResetPassword(selectedUser: UserDTO) {
        if (this.resetPasswordForm.invalid) {
            return;
        }
        if (selectedUser) {
            const data = {
                userId: selectedUser.id,
                newPassword: this.appService.encryptUsingAES256(this.resetPasswordForm.value.passwords.password),
            }
            this.requestsService.putRequest(ApiUrlConstants.USER_RESET_PASS_API_URL, data)
                .subscribe({
                    next: (response: HttpResponse<any>) => {
                        if (response.status === 200) {
                            this.appService.successUpdateMessage('User');
                            this.hideResetPasswordDialogAction();
                            this.searchUsers();
                        }
                    },
                    error: (error: any) => {
                        this.appService.handleError(error, 'User');
                    }
                });
        } else {
            this.toastService.error('Select item', 'User');
        }
    }

    onUnlockUserAction(selectedUser: any) {
        if (selectedUser) {
            const data = {
                id: selectedUser.id,
                status: 'Active',
            }
            this.requestsService.putRequest(ApiUrlConstants.USER_STATUS_API_URL, data)
                .subscribe({
                    next: (response: HttpResponse<any>) => {
                        if (response.status === 200) {
                            this.appService.successUpdateMessage('User');
                            this.searchUsers();
                        }
                    },
                    error: (error: any) => {
                        this.appService.handleError(error, 'User');
                    }
                });
        }
    }

    ngOnDestroy() {
        this.destroy.next(true);
    }
}
