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

@Component({
    selector: 'edit-user-component',
    templateUrl: './edit-user.template.html',
    styleUrls: ['./edit-user.component.less']
})
export class EditUserComponent implements OnInit {

    editUserForm: FormGroup = new FormGroup({});
    destroy: Subject<boolean> = new Subject();
    groups: any[] = [];
    departments: any[] = [];
    userId: any;
    selectedUser: UserDTO = new UserDTO();
    statuses = ReferencesStatuses.userStatuses;

    constructor(private fb: FormBuilder,
                private requestsService: RequestService,
                private appService: AppService,
                public appUtility: AppUtility,
                private router: Router,
                private activeRoute: ActivatedRoute) {
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
        const groups = this.requestsService.getRequest(ApiUrlConstants.GROUP_API_URL);
        const departments = this.requestsService.getRequest(ApiUrlConstants.DEPARTMENT_API_URL);
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
                            if (this.userId) {
                                this.getUserById(this.userId);
                            }
                        }
                    },
                    error: (error: any) => {
                        this.appService.handleError(error, 'User');
                    }
                });
    }

    buildForms() {
        this.editUserForm = this.fb.group({
            username: [null, [Validators.required, Validators.maxLength(35)]],
            name: [null, [Validators.required, Validators.maxLength(70)]],
            email: [null, [Validators.required, Validators.email, Validators.maxLength(50)]],
            phoneNumber: [null, [Validators.required, Validators.maxLength(32)]],
            mobileNumber: [null, [Validators.required, Validators.maxLength(32)]],
            passwords: this.fb.group({
                password: [null],
            }),
            groupId: [null, Validators.required],
            departmentId: [null],
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
        this.editUserForm.get('userId')?.setValue(userDto.id);
        this.editUserForm.get('username')?.setValue(userDto.username);
        this.editUserForm.get('name')?.setValue(userDto.name);
        this.editUserForm.get('email')?.setValue(userDto.email);
        this.editUserForm.get('phoneNumber')?.setValue(userDto.phoneNumber);
        this.editUserForm.get('mobileNumber')?.setValue(userDto.mobileNumber);
        this.editUserForm.get('group')?.setValue(userDto.groupId);
        this.editUserForm.get('department')?.setValue(userDto.departmentId);
        this.editUserForm.get('address')?.setValue(userDto?.address);
        this.editUserForm.get('status')?.setValue(userDto.status);
        this.editUserForm.markAllAsTouched();
    }

    updateUser() {
        if (this.editUserForm.invalid) {
            return;
        }
        let userDTO: UserDTO = new UserDTO();
        userDTO.convertToDTO(this.editUserForm.value);
        this.requestsService.putRequest(ApiUrlConstants.USER_API_URL, userDTO)
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

    ngOnDestroy() {
        this.destroy.next(true);
    }

}
