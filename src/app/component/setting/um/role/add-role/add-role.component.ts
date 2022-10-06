import {Component, OnInit} from '@angular/core';
import {ReferencesStatuses} from "../../../../../util/references.statuses";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {ConfirmationService} from "primeng/api";
import {RequestService} from "../../../../../service/request.service";
import {AppService} from "../../../../../service/app.service";
import {AppUtility} from "../../../../../util/app.utility";
import {ApiUrlConstants} from "../../../../../util/api.url.constants";
import {HttpResponse} from "@angular/common/http";
import {RoleDTO} from "../../../../../model/settings/um/role/role.dto";
import {RoleActionConstants} from "../../../../../util/role.actions.constants";
import {ToastrService} from "ngx-toastr";

@Component({
    selector: 'add-role-component',
    templateUrl: './add-role.template.html',
    styleUrls: ['./add-role.component.less']
})
export class AddRoleComponent implements OnInit {

    addRoleForm: FormGroup = new FormGroup({});
    roleActions = RoleActionConstants;
    statuses = ReferencesStatuses.statuses;
    permissions: any = [];

    constructor(private router: Router, private confirmationService: ConfirmationService,
                private fb: FormBuilder, private requestsService: RequestService,
                private appService: AppService, public appUtility: AppUtility,
                private toastService: ToastrService,) {
    }

    ngOnInit(): void {
        this.preLoadedData();
        this.buildForms();
    }

    preLoadedData() {
        this.requestsService.getRequest(ApiUrlConstants.MODULE_API_URL)
            .subscribe({
                next: (response: HttpResponse<any>) => {
                    if (response.status === 200) {
                        this.permissions = response.body.data;
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
        this.addRoleForm = this.fb.group({
            code: [null, [Validators.required, Validators.maxLength(17)]],
            name: [null, [Validators.required, Validators.maxLength(35)]],
            status: ['Active', Validators.required],
            remarks: ['', Validators.maxLength(256)],
            moduleActionList: []
        });
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

    createRolePermissions() {
        if (!this.roleActions.ROLE_ADD.value) {
            this.appService.noRightsMessage();
            return;
        }
        if (this.addRoleForm.invalid) {
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
        if (permissionsArray.length < 1) {
            this.toastService.error('Select permission', 'Permission');
            return;
        }
        this.addRoleForm.get('moduleActionList')?.patchValue(permissionsArray);
        let roleDTO: RoleDTO = new RoleDTO();
        roleDTO = roleDTO.convertToNewDTO(this.addRoleForm.value);
        if (roleDTO) {
            this.requestsService.postRequest(ApiUrlConstants.ROLE_API_URL, roleDTO)
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

    counter(i: number) {
        return new Array(i);
    }
}
