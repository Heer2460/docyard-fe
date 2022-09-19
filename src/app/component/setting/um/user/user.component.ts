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
import {DepartmentDTO} from "../../../../model/settings/ref/department/department.dto";
import {UserDTO} from "../../../../model/settings/um/user/user.dto";

@Component({
    selector: 'user-component',
    templateUrl: './user.template.html',
    styleUrls: ['./user.component.less']
})
export class UserComponent implements OnInit {

    searchUserForm: FormGroup = new FormGroup({});
    searchPopupToggle: boolean = false;
    users: UserDTO[] = [];
    groups: GroupDTO[] = [];
    departments: DepartmentDTO[] = [];
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
            label: 'Delete',
            icon: 'icon-trash',
            command: () => this.onItemDeleteAction(this.selectedUser)
        }
    ];
    statuses = ReferencesStatuses.userStatuses;

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
        this.searchUserForm = this.fb.group({
            username: [null],
            name: [null],
            group: [null],
            department: [null],
            status: ['Active'],
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
    }

    onViewOptionSelected(data: any) {
        this.router.navigate(['/setting/um/user/view/' + data.id]);
    }

    onEditOptionSelected(data: any) {
        this.router.navigate(['/setting/um/user/edit/' + data.id]);
    }

    onItemDeleteAction(data: any) {
        this.confirmationService.confirm({
            message: 'Are you sure that you want to perform this action?',
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
                    this.appService.handleError(error, 'Delete User');
                }
            });
        } else {
            this.toastService.error('Select Item', 'User');
        }
    }
    
    getGroupName(id: any) {
        if (id) {
            return this.groups.find((item: any) => Number(id) === item.id)?.name;
        }
        return '';
    }

    getDepartmentName(id: any) {
        if (id) {
            return this.departments.find((item: any) => Number(id) === item.id)?.name;
        }
        return '';
    }

    ngOnDestroy() {
        this.destroy.next(true);
    }

}
