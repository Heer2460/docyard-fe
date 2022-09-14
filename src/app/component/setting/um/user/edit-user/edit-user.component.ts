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
    selector: 'app-edit-user',
    templateUrl: './edit-user.component.html',
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
            group: [null, Validators.required],
            department: [null],
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
                        // this.populateUserForm(response.body.data);
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
