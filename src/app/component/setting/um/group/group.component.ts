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
import {GroupDTO} from "../../../../model/settings/um/group/group.dto";
import {RoleDTO} from "../../../../model/settings/um/role/role.dto";
import {RoleActionConstants} from "../../../../util/role.actions.constants";
import {BreadcrumbDTO} from "../../../../model/breadcrumb.dto";


@Component({
    selector: 'group-component',
    templateUrl: './group.template.html'
})
export class GroupComponent implements OnInit {
    addGroupForm: FormGroup = new FormGroup({});
    updateGroupForm: FormGroup = new FormGroup({});
    searchGroupForm: FormGroup = new FormGroup({});
    groups: GroupDTO[] = [];
    roles: RoleDTO[] = [];
    message: string = 'Click search to view groups.';
    visibleSearchGroupDialog: boolean = false;
    visibleAddGroupDialog: boolean = false;
    visibleUpdateGroupDialog: boolean = false;
    visibleViewGroupDialog: boolean = false;
    statuses = ReferencesStatuses.statuses;
    roleActions = RoleActionConstants;
    selectedGroup: GroupDTO = new GroupDTO();
    confirmationHeader: string = "Delete Group";
    actionItems: MenuItem[] = [
        {
            label: 'View',
            icon: 'icon-eye',
            visible: this.roleActions.GROUP_VIEW.value,
            command: () => this.onViewOptionSelected(this.selectedGroup)
        },
        {
            label: 'Edit',
            icon: 'icon-edit',
            visible: this.roleActions.GROUP_EDIT.value,
            command: () => this.onEditOptionSelected(this.selectedGroup)
        },
        {
            label: 'Delete',
            icon: 'icon-trash',
            visible: this.roleActions.GROUP_DEL.value,
            command: () => this.onItemDeleteAction(this.selectedGroup)
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
            label: 'Group',
            route: '/setting/um/group',
            active: true
        }
    ];

    title: string = 'Group';

    constructor(private router: Router, private confirmationService: ConfirmationService,
                private fb: FormBuilder, private requestsService: RequestService,
                private appService: AppService, public appUtility: AppUtility,
                private toastService: ToastrService) {
    }

    getAllRoles() {
        this.requestsService.getRequest(ApiUrlConstants.ROLE_API_URL + 'search?code=&name=&status=Active')
            .subscribe({
                next: (response: HttpResponse<any>) => {
                    if (response.status === 200) {
                        this.roles = response.body.data;

                    } else {
                        this.roles = [];
                    }
                },
                error: (error: any) => {
                    this.appService.handleError(error, 'Role');
                }
            });
    }

    ngOnInit(): void {
        this.buildForms();
        this.getAllRoles();
    }

    buildForms() {
        this.searchGroupForm = this.fb.group({
            code: ['', [Validators.maxLength(17)]],
            name: ['', [Validators.maxLength(35)]],
            status: ['Active'],
            roles: ['']
        });

        this.addGroupForm = this.fb.group({
            code: [null, [Validators.required, Validators.maxLength(17), Validators.pattern(/^[a-zA-Z0-9]*$/)]],
            name: [null, [Validators.required, Validators.maxLength(35), Validators.pattern(/^[a-zA-Z0-9\s]*$/)]],
            remarks: [null, [Validators.maxLength(256), Validators.pattern(/^[a-zA-Z0-9\s_-]*$/)]],
            status: ['Active'],
            role: [null, Validators.required]
        });

        this.updateGroupForm = this.fb.group({
            id: [''],
            code: [null, [Validators.required, Validators.maxLength(17), Validators.pattern(/^[a-zA-Z0-9]*$/)]],
            name: [null, [Validators.required, Validators.maxLength(35), Validators.pattern(/^[a-zA-Z0-9\s_-]*$/)]],
            remarks: [null, [Validators.maxLength(256), Validators.pattern(/^[a-zA-Z0-9\s_-]*$/)]],
            status: [null, Validators.required],
            role: [null, Validators.required]
        });
    }

    searchGroup() {
        if (this.searchGroupForm.invalid) {
            return;
        }
        let roles = this.searchGroupForm.value.roles == null ? '' : this.searchGroupForm.value.roles;

        let url = ApiUrlConstants.GROUP_API_URL + 'search?code=' + this.searchGroupForm.value.code +
            '&name=' + this.searchGroupForm.value.name + '&status=' + this.searchGroupForm.value.status + '&role=' + roles;
        this.requestsService.getRequest(url)
            .subscribe({
                next: (response: HttpResponse<any>) => {
                    if (response.status === 200) {
                        this.groups = response.body.data;
                    } else {
                        this.groups = [];
                        this.message = 'No group found.';
                    }
                    this.hideSearchPopupAction();
                },
                error: (error: any) => {
                    this.appService.handleError(error, 'Group');
                }
            });
    }

    createGroup() {
        if (this.addGroupForm.invalid) {
            return;
        }
        let groupDTO: GroupDTO = new GroupDTO();
        groupDTO = groupDTO.convertToNewDTO(this.addGroupForm.value);
        if (groupDTO) {
            this.requestsService.postRequest(ApiUrlConstants.GROUP_API_URL, groupDTO)
                .subscribe({
                    next: (response: HttpResponse<any>) => {
                        if (response.status === 200) {
                            this.appService.successAddMessage('Group');
                            this.searchGroup();
                            this.performHideAddAction();
                        }
                    },
                    error: (error: any) => {
                        this.appService.handleError(error, 'Group');
                    }
                });
        }
    }

    updateGroup() {
        if (this.updateGroupForm.invalid) {
            return;
        }
        let groupDTO: GroupDTO = new GroupDTO();
        groupDTO.convertToDTO(this.updateGroupForm.value);
        if (groupDTO) {
            this.requestsService.putRequest(ApiUrlConstants.GROUP_API_URL, groupDTO)
                .subscribe({
                    next: (response: HttpResponse<any>) => {
                        if (response.status === 200) {
                            this.appService.successUpdateMessage('Group');
                            this.searchGroup();
                            this.visibleUpdateGroupDialog = false;
                        }
                    },
                    error: (error: any) => {
                        this.appService.handleError(error, 'Group');
                    }
                });
        }
    }

    deleteGroup(id: any) {
        if (id) {
            this.requestsService.deleteRequest(ApiUrlConstants.GROUP_API_URL + id).subscribe({
                next: (response: HttpResponse<any>) => {
                    if (response.status == 200) {
                        this.appService.successDeleteMessage('Group');
                        this.searchGroup();
                    }
                },
                error: (error: any) => {
                    this.appService.handleError(error, 'Delete Group');
                }
            });
        } else {
            this.toastService.error('Select Item', 'Group');
        }
    }

    onMenuClicked(data: any) {
        this.selectedGroup = data;
    }

    onViewOptionSelected(data: any) {
        this.showViewGroupPopupAction();
    }

    onEditOptionSelected(data: any) {
        this.showUpdateGroupPopupAction();
        this.updateGroupForm.patchValue({
            id: data.id,
            code: data.code,
            name: data.name,
            status: data.status,
            role: data.role,
            remarks: data.remarks,
        });
    }

    showSearchPopupAction() {
        this.searchGroupForm.patchValue({
            code: '',
            name: '',
            roles: null,
            status: '',
        });
        this.visibleSearchGroupDialog = true;
    }

    hideSearchPopupAction() {
        this.searchGroupForm.patchValue({
            code: '',
            name: '',
            roles: null,
            status: '',
        });
        this.searchGroupForm.markAsUntouched();
        this.visibleSearchGroupDialog = false;

    }

    showViewGroupPopupAction() {
        this.visibleViewGroupDialog = true;
    }

    hideViewGroupPopupAction() {
        this.visibleViewGroupDialog = false;
    }

    showAddGroupPopupAction() {
        this.addGroupForm.reset();

        this.addGroupForm.markAsUntouched();
        this.addGroupForm.patchValue({
            code: '',
            name: '',
            remarks: '',
            role: null,
            status: 'Active',
        });
        this.visibleAddGroupDialog = true;
    }


    hideAddGroupPopupAction() {
        this.confirmationHeader = "Add Group";
        if(this.addGroupForm.dirty){
            this.confirmationService.confirm({
                message: 'Form shall be closed without saving data. Do you want to proceed?',
                accept: () => {
                    //Actual logic to perform a confirmation
                    this.performHideAddAction();
                }
            });
        }else{
            this.performHideAddAction();
        }
    }


    performHideAddAction() {
        this.addGroupForm.patchValue({
            code: '',
            name: '',
            remarks: '',
            role: null,
            status: 'Active',
        });
        this.addGroupForm.markAsUntouched();
        this.visibleAddGroupDialog = false;
    }

    showUpdateGroupPopupAction() {
        this.updateGroupForm.patchValue({
            code: '',
            name: '',
            status: '',
            role: '',
            remarks: '',
        });
        this.updateGroupForm.markAsUntouched();
        this.visibleUpdateGroupDialog = true;
    }

    hideUpdateGroupPopupAction() {
        this.confirmationHeader = "Update Group";
        if(this.updateGroupForm.dirty){
            this.confirmationService.confirm({
                message: 'Form shall be closed without saving data. Do you want to proceed?',
                accept: () => {
                    //Actual logic to perform a confirmation
                    this.visibleUpdateGroupDialog = false;
                }
            });
        }else{
            this.visibleUpdateGroupDialog = false;
        }
    }

    onItemDeleteAction(data: any) {
        this.confirmationHeader = "Delete Group";
        if (this.selectedGroup.status === 'Active') {
            this.toastService.error('Active record cannot be deleted', 'Group')
        } else {
            this.confirmationService.confirm({
                message: 'Are you sure you want to delete this record?',
                accept: () => {
                    //Actual logic to perform a confirmation
                    this.deleteGroup(data.id);
                }
            });
        }

    }

    addGroup() {
        if (!this.roleActions.GROUP_ADD.value) {
            this.appService.noRightsMessage();
            return;
        }
        this.showAddGroupPopupAction();
    }

    searchGroups() {
        if (!this.roleActions.GROUP_VIEW.value) {
            this.appService.noRightsMessage();
            return;
        }
        this.showSearchPopupAction();
    }

}
