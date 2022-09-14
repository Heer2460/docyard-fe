import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
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

@Component({
    selector: 'app-add-user',
    templateUrl: './add-user.component.html',
    styleUrls: ['./add-user.component.less']
})
export class AddUserComponent implements OnInit, OnDestroy {

    addUserForm: FormGroup = new FormGroup({});
    destroy: Subject<boolean> = new Subject();
    groups: any[] = [];
    departments: any[] = [];
    statuses = ReferencesStatuses.userStatuses;

    constructor(private fb: FormBuilder,
                private requestsService: RequestService,
                private appService: AppService,
                public appUtility: AppUtility,
                private router: Router) {
    }

    ngOnInit(): void {
        this.preloadedData();
        this.buildForms();
    }

    preloadedData(): void {
        const groups = this.requestsService.getRequest(ApiUrlConstants.DEPARTMENT_API_URL);
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
                        }
                    },
                    error: (error: any) => {
                        this.appService.handleError(error, 'User');
                    }
                });
    }

    buildForms() {
        this.addUserForm = this.fb.group({
            username: [null, [Validators.required, Validators.maxLength(35)]],
            name: [null, [Validators.required, Validators.maxLength(70)]],
            email: [null, [Validators.required, Validators.email, Validators.maxLength(50)]],
            phoneNumber: [null, [Validators.required, Validators.maxLength(32)]],
            mobileNumber: [null, [Validators.required, Validators.maxLength(32)]],

            passwords: this.fb.group({
                password: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(32), Validators.pattern(/^.{6,}$/)]],
                confirmPassword: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(32), Validators.pattern(/^.{6,}$/)]],
            }, {validators: CustomValidations.passwordConfirming}),

            group: [null, Validators.required],
            department: [null],
            address: [null, Validators.maxLength(256)],
            status: ['Active'],
        });
    }

    createUser() {
        if (this.addUserForm.invalid) {
            return;
        }
        let userDTO: UserDTO = new UserDTO();
        userDTO = userDTO.convertToNewDTO(this.addUserForm.value);
        if (userDTO) {
            this.requestsService.postRequest(ApiUrlConstants.USER_API_URL, userDTO)
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

    ngOnDestroy() {
        this.destroy.next(true);
    }
}
