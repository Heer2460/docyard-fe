import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {ReferencesStatuses} from "../../../../util/references.statuses";
import {ConfirmationService, MenuItem} from "primeng/api";
import {Router} from "@angular/router";
import {RequestService} from "../../../../service/request.service";
import {AppService} from "../../../../service/app.service";
import {AppUtility} from "../../../../util/app.utility";
import {ToastrService} from "ngx-toastr";
import {ApiUrlConstants} from "../../../../util/api.url.constants";
import {HttpResponse} from "@angular/common/http";
import {RoleDTO} from "../../../../model/settings/um/role/role.dto";
import {RoleActionConstants} from "../../../../util/role.actions.constants";
import {BreadcrumbDTO} from "../../../../model/breadcrumb.dto";

@Component({
    selector: 'role-component',
    templateUrl: './role.template.html',
    styleUrls: ['./role.component.less']
})
export class RoleComponent implements OnInit {

    searchRoleForm: FormGroup = new FormGroup({});
    roles: any[] = [];
    message: string = 'Click search to view roles.';
    searchDialog: boolean = false;
    statuses = ReferencesStatuses.statuses;
    selectedRole: RoleDTO = new RoleDTO();
    roleActions = RoleActionConstants;
    actionItems: MenuItem[] = [
        {
            label: 'View',
            icon: 'icon-eye',
            visible: this.roleActions.ROLE_VIEW.value,
            command: () => this.onViewOptionSelected(this.selectedRole)
        },
        {
            label: 'Edit',
            icon: 'icon-edit',
            visible: this.roleActions.ROLE_EDIT.value,
            command: () => this.onEditOptionSelected(this.selectedRole)
        },
        {
            label: 'Delete',
            icon: 'icon-trash',
            visible: this.roleActions.ROLE_DEL.value,
            command: () => this.onItemDeleteAction(this.selectedRole)
        }
    ];

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
            label: 'Role',
            route: '/setting/um/role',
            active: true
        }
    ];

    title: string = 'Role';

    constructor(private router: Router, private confirmationService: ConfirmationService,
                private fb: FormBuilder, private requestsService: RequestService,
                private appService: AppService, public appUtility: AppUtility,
                private toastService: ToastrService) {
    }

    ngOnInit(): void {
        this.buildForms();
    }

    buildForms() {
        this.searchRoleForm = this.fb.group({
            code: [''],
            name: [''],
            status: ['']
        });
    }

    searchRoles() {
        let url = ApiUrlConstants.ROLE_API_URL + 'search' + '?code=' + this.searchRoleForm.value.code +
            '&name=' + this.searchRoleForm.value.name + '&status=' + this.searchRoleForm.value.status;
        this.requestsService.getRequest(url)
            .subscribe({
                next: (response: HttpResponse<any>) => {
                    if (response.status === 200) {
                        this.roles = response.body.data;
                    } else {
                        this.roles = [];
                        this.message = 'No role found.'
                    }
                    this.hideSearchPopupAction();
                },
                error: (error: any) => {
                    this.appService.handleError(error, 'Role');
                }
            });
    }

    deleteRole(id: any) {
        if (id) {
            this.requestsService.deleteRequest(ApiUrlConstants.ROLE_API_URL + id).subscribe({
                next: (response: HttpResponse<any>) => {
                    if (response.status == 200) {
                        this.appService.successDeleteMessage('Role');
                        this.searchRoles();
                    }
                },
                error: (error: any) => {
                    this.appService.handleError(error, 'Delete Role');
                }
            });
        } else {
            this.toastService.error('Select Item', 'Role');
        }
    }

    onMenuClicked(data: any) {
        this.selectedRole = data;
    }

    onViewOptionSelected(data: any) {
        this.router.navigate(['/setting/um/role/view/' + data.id]);
    }

    onEditOptionSelected(data: any) {
        this.router.navigate(['/setting/um/role/edit/' + data.id]);
    }

    showSearchPopupAction() {
        this.searchRoleForm.patchValue({
            code: '',
            name: '',
            status: '',
        });
        this.searchDialog = true;
    }

    hideSearchPopupAction() {
        this.searchDialog = false;
    }

    onItemDeleteAction(data: any) {
        if (this.selectedRole.status === 'Active') {
            this.toastService.error('Active record cannot be deleted', 'Role')
        } else {
            this.confirmationService.confirm({
                message: 'Are you sure you want to delete this record?',
                accept: () => {
                    //Actual logic to perform a confirmation
                    this.deleteRole(data.id)
                }
            });
        }
    }

    addRole() {
        if (!this.roleActions.ROLE_ADD.value) {
            this.appService.noRightsMessage();
            return;
        }
        this.router.navigate(['/setting/um/role/add']);
    }

    searchRole() {
        if (!this.roleActions.ROLE_VIEW.value) {
            this.appService.noRightsMessage();
            return;
        }
        this.showSearchPopupAction();
    }

}
