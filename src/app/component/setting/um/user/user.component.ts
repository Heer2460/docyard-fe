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

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.less']
})
export class UserComponent implements OnInit {

    searchUserForm: FormGroup = new FormGroup({});
    searchPopupToggle: boolean = false;
    dataRows: any[] = [
        {
            name: 'Umar farooq',
            username: 'umar',
            address: 'street #01, johar town'
        }
    ];
    users: any[] = [];
    groups: any[] = [];
    departments: any[] = [];
    selectedUser: any;
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
        this.buildForms();
        this.searchUsers();
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
        this.router.navigate(['/setting/um/user/view']);
    }

    onEditOptionSelected(data: any) {
        this.router.navigate(['/setting/um/user/edit']);
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

}
