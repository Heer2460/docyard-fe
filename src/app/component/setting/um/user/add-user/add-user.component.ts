import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ConfirmationService} from "primeng/api";
import {ReferencesStatuses} from "../../../../../util/references.statuses";
import {CustomValidations} from "../../../../../util/custom.validations";
import {ApiUrlConstants} from "../../../../../util/api.url.constants";
import {RequestService} from "../../../../../service/request.service";
import {AppService} from "../../../../../service/app.service";
import {AppUtility} from "../../../../../util/app.utility";
import {forkJoin, Subject, takeUntil} from "rxjs";
import {HttpResponse} from "@angular/common/http";
import {UserDTO} from "../../../../../model/settings/um/user/user.dto";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {GroupDTO} from "../../../../../model/settings/um/group/group.dto";
import {DepartmentDTO} from "../../../../../model/settings/ref/department/department.dto";
import {RoleActionConstants} from "../../../../../util/role.actions.constants";
import {BreadcrumbDTO} from "../../../../../model/breadcrumb.dto";
import {AppConstants} from "../../../../../util/app.constants";


@Component({
    selector: 'add-user-component',
    templateUrl: './add-user.template.html',
    styleUrls: ['./add-user.component.less']
})
export class AddUserComponent implements OnInit, OnDestroy {

    addUserForm: FormGroup = new FormGroup({});
    destroy: Subject<boolean> = new Subject();
    groups: GroupDTO[] = [];
    departments: DepartmentDTO[] = [];
    statuses = ReferencesStatuses.userStatuses;
    logoImageDataUrl: any;
    files: any[] = [];
    roleActions = RoleActionConstants;
    passwordVisibility: boolean = true;
    confirmPasswordVisibility: boolean = true;
    userId: any;
    selectedUser: UserDTO = new UserDTO();
    editUserForm: FormGroup = new FormGroup({});

    breadcrumbs: BreadcrumbDTO[] = [
        {
            label: 'Home',
            route: '/home',
            active: false
        },
        {
            label: 'Settings',
            route: '/setting',
            active: false
        },
        {
            label: 'User Management',
            active: false
        },
        {
            label: 'Users',
            route: '/setting/um/user',
            active: false
        },
        {
            label: 'Add',
            route: '/setting/um/user/add',
            active: true
        }
    ];

    title: string = 'Add';

    constructor(private fb: FormBuilder, private confirmationService: ConfirmationService,
                private requestsService: RequestService,
                private appService: AppService,
                public appUtility: AppUtility,
                private router: Router,
                private toastService: ToastrService) {
    }

    ngOnInit(): void {
        this.preloadedData();
        this.buildForms();
    }

    togglePasswordVisibility() {
        this.passwordVisibility = !this.passwordVisibility;
    }

    toggleConfirmPasswordVisibility() {
        this.confirmPasswordVisibility = !this.confirmPasswordVisibility;
    }

    preloadedData(): void {
        const groups = this.requestsService.getRequest(ApiUrlConstants.GROUP_API_URL + 'search?status=Active');
        const departments = this.requestsService.getRequest(ApiUrlConstants.DEPARTMENT_API_URL + 'search?code=&name=&status=Active');
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
        this.addUserForm = this.fb.group({
            username: [null, [Validators.required, Validators.maxLength(17), Validators.pattern(/^[a-zA-Z0-9._-]*$/)]],
            name: [null, [Validators.required, Validators.maxLength(32), Validators.pattern(/^[a-zA-Z0-9\s]*$/)]],
            email: [null, [Validators.required, Validators.email, Validators.maxLength(50)]],
            phoneNumber: [null, [Validators.maxLength(17)]],
            mobileNumber: [null, [Validators.maxLength(17)]],
            passwords: this.fb.group({
                password: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(32), Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,32}$/)]],
                confirmPassword: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(32), Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,32}$/)]],
            }, {validators: CustomValidations.passwordConfirming}),
            groupId: [null, Validators.required],
            departmentIds: [''],
            address: [null, Validators.maxLength(256)],
            status: [{value: 'Active', disabled: true}],
        });
    }

    createUser() {
        if (!this.roleActions.USER_ADD.value) {
            this.appService.noRightsMessage();
            return;
        }
        if (this.addUserForm.invalid) {
            return;
        }
        let userDTO: UserDTO = new UserDTO();
        userDTO = userDTO.convertToNewDTO(this.addUserForm.getRawValue());
        userDTO.password = this.appService.encryptUsingAES256(userDTO.password);
        userDTO.createdBy = Number(localStorage.getItem(window.btoa(AppConstants.AUTH_USER_ID)));
        if (userDTO) {
            this.requestsService.postRequestMultipartFormAndData(ApiUrlConstants.USER_API_URL, this.files, userDTO)
                .subscribe({
                    next: (response: HttpResponse<any>) => {
                        if (response.status === 200) {
                            this.appService.successAddMessage('User');
                            this.router.navigate(['setting/um/user']);
                        }
                    },
                    error: (error: any) => {
                        this.appService.handleError(error, 'User');
                    }
                });
        }
    }

    setAttachment(event: any) {
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
            let obj = {
                type: 'logo',
                data: event.target.files[0]
            };
            this.files.push(obj);
            let reader = new FileReader();
            reader.onload = this.handleReaderLoadedProfileImage.bind(this);
            this.logoImageDataUrl = reader.readAsBinaryString(obj.data);
        }
    }

    handleReaderLoadedProfileImage(readerEvt: any) {
        let binaryString = readerEvt.target.result;
        this.logoImageDataUrl = window.btoa(binaryString);
    }

    onCancelButtonClicked() {
        if (this.addUserForm.dirty) {
            this.confirmationService.confirm({
                message: 'Form shall be closed without saving data. Do you want to proceed?',
                accept: () => {
                    //Actual logic to perform a confirmation
                    this.router.navigate(['/setting/um/user']);
                }
            });
        } else {
            this.router.navigate(['/setting/um/user']);
        }
    }

    clearFiles() {
        this.logoImageDataUrl = null;
        this.files = [];
    }

    ngOnDestroy() {
        this.destroy.next(true);
    }
}
