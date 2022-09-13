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
    selector: 'app-role',
    templateUrl: './role.component.html',
    styleUrls: ['./role.component.less']
})
export class RoleComponent implements OnInit {

    addRoleForm: FormGroup = new FormGroup({});
    updateRoleForm: FormGroup = new FormGroup({});
    searchRoleForm: FormGroup = new FormGroup({});
    roles: any[] = [];
    message: string = 'Click search to get roles.';
    searchDialog: boolean = false;
    addDialog: boolean = false;
    updateDialog: boolean = false;
    viewDialog: boolean = false;
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
        // this.searchRoles();
    }

    buildForms() {
        this.searchRoleForm = this.fb.group({
            code: [''],
            name: [''],
            status: ['']
        });

        this.addRoleForm = this.fb.group({
            code: [null, [Validators.required, Validators.maxLength(17)]],
            name: [null, [Validators.required, Validators.maxLength(35)]],
            remarks: [null, Validators.maxLength(256)],
            status: ['Active'],
        });

        this.updateRoleForm = this.fb.group({
            id: [null, Validators.required],
            code: [null, [Validators.required, Validators.maxLength(17)]],
            name: [null, [Validators.required, Validators.maxLength(35)]],
            remarks: [null, Validators.maxLength(256)],
            status: [null, Validators.required],
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

    createRole() {
        if (this.addRoleForm.invalid) {
            return;
        }
        let roleDTO: RoleDTO = new RoleDTO();
        roleDTO = roleDTO.convertToNewDTO(this.addRoleForm.value);
        if (roleDTO) {
            this.requestsService.postRequest(ApiUrlConstants.ROLE_API_URL, roleDTO)
                .subscribe({
                    next: (response: HttpResponse<any>) => {
                        if (response.status === 200) {
                            this.appService.successAddMessage('Role');
                            this.searchRoles();
                            this.hideAddPopupAction();
                        }
                    },
                    error: (error: any) => {
                        this.appService.handleError(error, 'Role');
                    }
                });
        }
    }

    updateRole() {
        if (this.updateRoleForm.invalid) {
            return;
        }
        let roleDTO: RoleDTO = new RoleDTO();
        roleDTO.convertToDTO(this.updateRoleForm.value);
        if (roleDTO) {
            this.requestsService.putRequest(ApiUrlConstants.ROLE_API_URL, roleDTO)
                .subscribe({
                    next: (response: HttpResponse<any>) => {
                        if (response.status === 200) {
                            this.appService.successUpdateMessage('Role');
                            this.searchRoles();
                            this.hideUpdatePopupAction();
                        }
                    },
                    error: (error: any) => {
                        this.appService.handleError(error, 'Role');
                    }
                });
        }
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
        this.showViewPopupAction();
    }

    onEditOptionSelected(data: any) {
        this.showUpdatePopupAction();
        this.updateRoleForm.patchValue({
            id: data.id,
            code: data.code,
            name: data.name,
            status: data.status,
            remarks: data.remarks,
        });
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

    showViewPopupAction() {
        this.viewDialog = true;
    }

    hideViewPopupAction() {
        this.viewDialog = false;
    }

    showAddPopupAction() {
        this.addRoleForm.patchValue({
            code: '',
            name: '',
            remarks: '',
            status: 'Active',
        });
        this.addRoleForm.markAsUntouched();
        this.addDialog = true;
    }

    hideAddPopupAction() {
        this.addDialog = false;
    }

    showUpdatePopupAction() {
        this.updateRoleForm.patchValue({
            code: '',
            name: '',
            status: '',
            remarks: '',
        });
        this.updateRoleForm.markAsUntouched();
        this.updateDialog = true;
    }

    hideUpdatePopupAction() {
        this.updateDialog = false;
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
