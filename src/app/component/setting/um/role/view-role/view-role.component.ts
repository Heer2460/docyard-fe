import {Component, OnInit} from '@angular/core';
import {RoleDTO} from "../../../../../model/settings/um/role/role.dto";
import {ApiUrlConstants} from "../../../../../util/api.url.constants";
import {HttpResponse} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import {RequestService} from "../../../../../service/request.service";
import {AppService} from "../../../../../service/app.service";
import {BreadcrumbDTO} from "../../../../../model/breadcrumb.dto";

@Component({
    selector: 'app-view-role',
    templateUrl: './view-role.template.html',
    styleUrls: ['./view-role.component.less']
})
export class ViewRoleComponent implements OnInit {

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
            label: 'View',
            route: '/setting/um/role/view',
            active: true
        }
    ];
    
    title: string = 'View';

    constructor(private activeRoute: ActivatedRoute,
                private requestsService: RequestService,
                private appService: AppService) {
    }

    ngOnInit(): void {
        if (this.activeRoute.snapshot.paramMap.get('id')) {
            this.roleId = this.activeRoute.snapshot.paramMap.get('id')
        }
        this.preLoadedData();
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

    getRoleById(id: number) {
        this.requestsService.getRequest(ApiUrlConstants.ROLE_API_URL + id)
            .subscribe({
                next: (response: HttpResponse<any>) => {
                    if (response.status === 200) {
                        this.selectedRole = response.body.data;
                        if (this.selectedRole.moduleActionList.length > 0) {
                            this.populateSelectedPermissions(this.selectedRole.moduleActionList);
                        }
                    }
                }, error: (error: any) => {
                    this.appService.handleError(error, 'User');
                }
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

}
