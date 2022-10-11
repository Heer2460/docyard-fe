import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ReferencesStatuses} from "../../../../../util/references.statuses";
import {ActivatedRoute, Router} from "@angular/router";
import {ConfirmationService} from "primeng/api";
import {RequestService} from "../../../../../service/request.service";
import {AppService} from "../../../../../service/app.service";
import {AppUtility} from "../../../../../util/app.utility";
import {ApiUrlConstants} from "../../../../../util/api.url.constants";
import {HttpResponse} from "@angular/common/http";
import {RoleDTO} from "../../../../../model/settings/um/role/role.dto";
import {RoleActionConstants} from "../../../../../util/role.actions.constants";
import {BreadcrumbDTO} from "../../../../../model/breadcrumb.dto";

@Component({
    selector: 'edit-role-component',
    templateUrl: './edit-role.template.html',
    styleUrls: ['./edit-role.component.less']
})
export class EditRoleComponent implements OnInit {

    editRoleForm: FormGroup = new FormGroup({});
    roleActions = RoleActionConstants;
    statuses = ReferencesStatuses.statuses;
    permissions: any = [];
    roleId: any;
    selectedRole: RoleDTO = new RoleDTO();
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
            active: false
        },
        {
            label: 'Edit',
            route: '/setting/um/role/edit',
            active: true
        }
    ];

    title: string = 'Edit';

    constructor(private router: Router, private confirmationService: ConfirmationService,
                private fb: FormBuilder, private requestsService: RequestService,
                private appService: AppService, public appUtility: AppUtility,
                private activeRoute: ActivatedRoute) {
    }

    ngOnInit(): void {
        if (this.activeRoute.snapshot.paramMap.get('id')) {
            this.roleId = this.activeRoute.snapshot.paramMap.get('id')
        }
        this.preLoadedData();
        this.buildForms();
    }

    preLoadedData() {
        this.requestsService.getRequest(ApiUrlConstants.MODULE_API_URL)
            .subscribe({
                next: (response: HttpResponse<any>) => {
                    if (response.status === 200) {
                        this.permissions = response.body.data;
                        this.getRoleById(this.roleId);
                    } else {
                        this.permissions = [];
                    }
                },
                error: (error: any) => {
                    this.appService.handleError(error, 'Permissions');
                }
            });
    }

    buildForms() {
        this.editRoleForm = this.fb.group({
            id: [null],
            code: [null, [Validators.required, Validators.maxLength(17), Validators.pattern(/^[a-zA-Z0-9_-]*$/)]],
            name: [null, [Validators.required, Validators.maxLength(35), Validators.pattern(/^[a-zA-Z0-9_-]*$/)]],
            status: ['Active', Validators.required],
            remarks: ['', [Validators.maxLength(256), Validators.pattern(/^[a-zA-Z0-9_-]*$/)]],
            moduleActionList: []
        });
    }

    getRoleById(id: number) {
        this.requestsService.getRequest(ApiUrlConstants.ROLE_API_URL + id)
            .subscribe({
                next: (response: HttpResponse<any>) => {
                    if (response.status === 200) {
                        this.selectedRole = response.body.data;
                        this.populateRoleForm(response.body.data);
                    }
                }, error: (error: any) => {
                    this.appService.handleError(error, 'User');
                }
            });
    }

    populateRoleForm(roleDto: RoleDTO) {
        this.editRoleForm.get('id')?.setValue(roleDto.id);
        this.editRoleForm.get('code')?.setValue(roleDto.code);
        this.editRoleForm.get('name')?.setValue(roleDto.name);
        this.editRoleForm.get('status')?.setValue(roleDto.status);
        this.editRoleForm.get('remarks')?.setValue(roleDto.remarks);
        this.editRoleForm.markAllAsTouched();
        if (roleDto.moduleActionList.length > 0) {
            this.populateSelectedPermissions(roleDto.moduleActionList);
        }
    }

    checkAllChildrenPermissions(permission: any, event: any) {
        const isChecked = event.target.checked;
        permission.checked = isChecked;
        let permissions = permission.children;
        for (let i = 0; i < permissions.length; i++) {
            permissions[i].checked = isChecked;
            this.checkAllActionPermissions(permissions[i], event);
        }
    }

    isParentChecked(permission: any, parent: any) {
        let checkedItems = permission.filter((item: any) => item.checked);
        let permissionLength = permission.length;
        let checkedItemsLength = checkedItems.length;
        parent.checked = permissionLength == checkedItemsLength;
    }

    checkAllActionPermissions(permission: any, event: any, item?: any, parent?: any) {
        const isChecked = event.target.checked;
        permission.checked = isChecked;
        if (item && parent) {
            this.isParentChecked(item, parent);
        }
        let permissions = permission.moduleActionDTOList;
        if (permissions) {
            for (let i = 0; i < permissions.length; i++) {
                permissions[i].checked = isChecked;
            }
        }
    }

    counter(i: number) {
        return new Array(i);
    }

    populateSelectedPermissions(selectedPermissionIds: any) {
        this.permissions.forEach((parent: any) => {
            if (parent.children) {
                parent.children.forEach((child: any) => {
                    child.moduleActionDTOList.forEach((action: any) => {
                        selectedPermissionIds.forEach((item: any) => {
                            if (item == action.moduleActionId) {
                                action.checked = true;
                                this.isParentChecked(child.moduleActionDTOList, child);
                            }
                        });
                    });
                    this.isParentChecked(parent.children, parent);
                });
            }
        });
    }

    updateRolePermissions() {
        if (!this.roleActions.ROLE_EDIT.value) {
            this.appService.noRightsMessage();
            return;
        }
        if (this.editRoleForm.invalid) {
            return;
        }
        let permissionsArray: any[] = [];
        this.permissions.forEach((parent: any) => {
            if (parent.children) {
                parent.children.forEach((child: any) => {
                    child.moduleActionDTOList.forEach((action: any) => {
                        if (action.checked) {
                            permissionsArray.push(action.moduleActionId);
                        }
                    });
                });
            }
        });
        this.editRoleForm.get('moduleActionList')?.patchValue(permissionsArray);
        let roleDTO: RoleDTO = new RoleDTO();
        roleDTO.convertToDTO(this.editRoleForm.value);
        if (roleDTO) {
            this.requestsService.putRequest(ApiUrlConstants.ROLE_API_URL, roleDTO)
                .subscribe({
                    next: (response: HttpResponse<any>) => {
                        if (response.status === 200) {
                            this.appService.successAddMessage('Role');
                            this.router.navigate(['/setting/um/role']);
                        }
                    },
                    error: (error: any) => {
                        this.appService.handleError(error, 'Role');
                    }
                });
        }
    }
    onCancelButtonClicked() {
        if(this.editRoleForm.dirty){
            this.confirmationService.confirm({
                message: 'Form shall be closed without saving data. Do you want to proceed?',
                accept: () => {
                    //Actual logic to perform a confirmation
                    this.router.navigate(['/setting/um/role']);
                }
            });
        }else{
            this.router.navigate(['/setting/um/role']);
        }
    }

}
