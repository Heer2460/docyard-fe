import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
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

@Component({
    selector: 'role-component',
    templateUrl: './role.template.html',
    styleUrls: ['./role.component.less']
})
export class RoleComponent implements OnInit {

    searchRoleForm: FormGroup = new FormGroup({});
    roles: any[] = [];
    message: string = 'Click search to get roles.';
    searchDialog: boolean = false;
    statuses = ReferencesStatuses.statuses;
    selectedRole: RoleDTO = new RoleDTO();

    actionItems: MenuItem[] = [
        {
            label: 'View',
            icon: 'icon-eye',
            command: () => this.onViewOptionSelected(this.selectedRole)
        },
        {
            label: 'Edit',
            icon: 'icon-edit',
            command: () => this.onEditOptionSelected(this.selectedRole)
        },
        {
            label: 'Delete',
            icon: 'icon-trash',
            command: () => this.onItemDeleteAction(this.selectedRole)
        }
    ];

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
        this.router.navigate(['/setting/um/role/view']);
    }

    onEditOptionSelected(data: any) {
        this.router.navigate(['/setting/um/role/edit']);
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
        this.confirmationService.confirm({
            message: 'Are you sure that you want to perform this action?',
            accept: () => {
                //Actual logic to perform a confirmation
                this.deleteRole(data.id)
            }
        });
    }

}
