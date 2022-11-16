import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {forkJoin, Subject, takeUntil} from "rxjs";
import {ReferencesStatuses} from "../../../../../util/references.statuses";
import {RequestService} from "../../../../../service/request.service";
import {AppService} from "../../../../../service/app.service";
import {AppUtility} from "../../../../../util/app.utility";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiUrlConstants} from "../../../../../util/api.url.constants";
import {HttpResponse} from "@angular/common/http";
import {UserDTO} from "../../../../../model/settings/um/user/user.dto";
import {GroupDTO} from "../../../../../model/settings/um/group/group.dto";
import {DepartmentDTO} from "../../../../../model/settings/ref/department/department.dto";
import {ToastrService} from "ngx-toastr";
import {RoleActionConstants} from "../../../../../util/role.actions.constants";
import {BreadcrumbDTO} from "../../../../../model/breadcrumb.dto";
import {ConfirmationService} from "primeng/api";

@Component({
    selector: 'edit-user-component',
    templateUrl: './edit-user.template.html',
    styleUrls: ['./edit-user.component.less']
})
export class EditUserComponent implements OnInit {

    editUserForm: FormGroup = new FormGroup({});
    destroy: Subject<boolean> = new Subject();
    groups: GroupDTO[] = [];
    departments: DepartmentDTO[] = [];
    userId: any;
    selectedUser: UserDTO = new UserDTO();
    logoImageDataUrl: any;
    files: any[] = [];
    roleActions = RoleActionConstants;
    statuses = ReferencesStatuses.userStatuses;

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
            label: 'Edit',
            route: '/setting/um/user/edit',
            active: true
        }
    ];

    title: string = 'Edit';

    constructor(private fb: FormBuilder,
                private confirmationService:ConfirmationService,
                private requestsService: RequestService,
                private appService: AppService,
                public appUtility: AppUtility,
                private router: Router,
                private activeRoute: ActivatedRoute,
                private toastService: ToastrService) {
    }

    ngOnInit(): void {
        this.activeRoute.queryParams.subscribe((params) => {
            if (params['id']) {
                this.userId = params['id'];
            }
        });
        this.preloadedData();
        this.buildForms();
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
                        if (this.userId) {
                            this.getUserById(this.userId);
                        }
                    },
                    error: (error: any) => {
                        this.appService.handleError(error, 'User');
                    }
                });
    }

    buildForms() {
        this.editUserForm = this.fb.group({
            id: [null],
            username: [{ value: null, disabled: true }],
            name: [null, [Validators.required, Validators.maxLength(32), Validators.pattern(/^[a-zA-Z0-9\s]*$/)]],
            email: [null, [Validators.required, Validators.email, Validators.maxLength(50)]],
            phoneNumber: [null, Validators.maxLength(17)],
            mobileNumber: [null, Validators.maxLength(17)],
            passwords: this.fb.group({
                password: [null],
            }),
            groupId: [null, Validators.required],
            departmentIds: [''],
            profilePhoto: [''],
            address: [null, Validators.maxLength(256)],
            status: ['Active'],
        });
    }

    getUserById(id: number) {
        this.requestsService.getRequest(ApiUrlConstants.USER_API_URL + id)
            .subscribe({
                next: (response: HttpResponse<any>) => {
                    if (response.status === 200) {
                        this.selectedUser = response.body.data;
                        this.populateUserForm(response.body.data);
                    }
                }, error: (error: any) => {
                    this.appService.handleError(error, 'User');
                }
            });
    }
    populateUserForm(userDto: UserDTO) {
        this.editUserForm.get('id')?.setValue(userDto.id);
        this.editUserForm.get('username')?.setValue(userDto.username);
        this.editUserForm.get('name')?.setValue(userDto.name);
        this.editUserForm.get('email')?.setValue(userDto.email);
        this.editUserForm.get('phoneNumber')?.setValue(userDto.phoneNumber);
        this.editUserForm.get('mobileNumber')?.setValue(userDto.mobileNumber);
        this.editUserForm.get('groupId')?.setValue(userDto.groupId);
        this.editUserForm.get('departmentIds')?.setValue(this.setDepartmentIds(userDto.departmentIds));
        this.editUserForm.get('address')?.setValue(userDto?.address);
        this.editUserForm.get('status')?.setValue(userDto.status);
        this.editUserForm.get('profilePhoto')?.setValue(userDto.profilePhoto);
        userDto.profilePhoto ? this.logoImageDataUrl = userDto.profilePhoto : this.logoImageDataUrl = '';
        this.editUserForm.markAllAsTouched();
    }

    setDepartmentIds(ids: any) {
        let idsArray: number[] = [];
        if (ids && ids.length > 0) {
            ids.map((item: number) => idsArray.push(Number(item)));
        }
        return idsArray;
    }

    updateUser() {
        if (!this.roleActions.USER_EDIT.value) {
            this.appService.noRightsMessage();
            return;
        }
        if (this.editUserForm.invalid) {
            return;
        }
        let userDTO: UserDTO = new UserDTO();
        userDTO.convertToDTO(this.editUserForm.getRawValue());
        this.requestsService.putRequestMultipartFormAndData(ApiUrlConstants.USER_API_URL, this.files, userDTO)
            .subscribe({
                next: (response: HttpResponse<any>) => {
                    if (response.status === 200) {
                        this.appService.successUpdateMessage('User');
                        this.router.navigate(['setting/um/user']);
                    }
                }, error: (error: any) => {
                    this.appService.handleError(error, 'User');
                }
            });
    }

    setAttachment(event: any) {
        let format;
        let size;
        if (event.target.files.length > 0) {
            size = event.target.files[0].size / 1024 / 1024;
            if (size > 1) {
                this.toastService.error('File size not valid.', 'Profile Picture');
                return;
            }
            format = event.target.files[0].type;
            if (!format.includes('image/')) {
                this.toastService.error('Image format not valid.', 'Profile Picture');
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
        if (this.editUserForm.dirty || this.editUserForm.touched) {
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
