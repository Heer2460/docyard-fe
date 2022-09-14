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


@Component({
    selector: 'group-component',
    templateUrl: './group.template.html'
})
export class GroupComponent implements OnInit {
    addGroupForm: FormGroup = new FormGroup({});
    updateGroupForm: FormGroup = new FormGroup({});
    searchGroupForm: FormGroup = new FormGroup({});
    groups: any[] = [];
    roles: any[] = [];
    selectedRoles = '';
    message: string = 'Click search to get groups.';
    visibleSearchGroupDialog: boolean = false;
    visibleAddGroupDialog: boolean = false;
    visibleUpdateGroupDialog: boolean = false;
    visibleViewGroupDialog: boolean = false;
    statuses = ReferencesStatuses.statuses;

    selectedGroup: GroupDTO = new GroupDTO();

    actionItems: MenuItem[] = [
        {
            label: 'View',
            icon: 'icon-eye',
            command: () => this.onViewOptionSelected(this.selectedGroup)
        },
        {
            label: 'Edit',
            icon: 'icon-edit',
            command: () => this.onEditOptionSelected(this.selectedGroup)
        },
        {
            label: 'Delete',
            icon: 'icon-trash',
            command: () => this.onItemDeleteAction(this.selectedGroup)
        }
    ];

    constructor(private router: Router, private confirmationService: ConfirmationService,
                private fb: FormBuilder, private requestsService: RequestService,
                private appService: AppService, public appUtility: AppUtility,
                private toastService: ToastrService,
    ) {
    }

    searchRoles() {
        let url = ApiUrlConstants.ROLE_API_URL + 'search' + '?code=' + this.searchGroupForm.value.code +
            '&name=' + this.searchGroupForm.value.name + '&status=' + this.searchGroupForm.value.status;
        this.requestsService.getRequest(url)
            .subscribe({
                next: (response: HttpResponse<any>) => {
                    if (response.status === 200) {
                        this.roles = response.body.data;

                    } else {
                        this.roles = [];
                        this.message = 'No role found.';
                    }
                    this.hideSearchPopupAction();
                },
                error: (error: any) => {
                    this.appService.handleError(error, 'Role');
                }
            });
    }

    ngOnInit(): void {
        this.buildForms();
        this.searchGroup();
        this.searchRoles();
    }

    buildForms() {
        this.searchGroupForm = this.fb.group({
            code: [null, [Validators.maxLength(17)]],
            name: [null, [Validators.maxLength(35)]],
            status: ['Active'],
            roles: []
        });

        this.addGroupForm = this.fb.group({
            code: [null, [Validators.required, Validators.maxLength(17)]],
            name: [null, [Validators.required, Validators.maxLength(35)]],
            remarks: [null, [Validators.required, Validators.maxLength(256)]],
            status: ['Active'],
            roles: []
        });

        this.updateGroupForm = this.fb.group({
            code: [null, [Validators.required, Validators.maxLength(17)]],
            name: [null, [Validators.required, Validators.maxLength(35)]],
            remarks: [null, [Validators.maxLength(256)]],
            status: [null, Validators.required],
            roles: []
        });
    }

    searchGroup() {
        let url = ApiUrlConstants.GROUP_API_URL + 'search?code=' + this.searchGroupForm.value.code +
            '&name=' + this.searchGroupForm.value.name + '&status=' + this.searchGroupForm.value.status;
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
            this.requestsService.postRequest(ApiUrlConstants.ROLE_API_URL, groupDTO)
                .subscribe({
                    next: (response: HttpResponse<any>) => {
                        if (response.status === 200) {
                            this.appService.successAddMessage('Group');
                            this.searchGroup();
                            this.hideAddGroupPopupAction();
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
            this.requestsService.putRequest(ApiUrlConstants.ROLE_API_URL, groupDTO)
                .subscribe({
                    next: (response: HttpResponse<any>) => {
                        if (response.status === 200) {
                            this.appService.successUpdateMessage('Role');
                            this.searchGroup();
                            this.hideUpdateGroupPopupAction();
                        }
                    },
                    error: (error: any) => {
                        this.appService.handleError(error, 'Role');
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
            role: data.roles,
            remarks: data.remarks,
        });
    }

    showSearchPopupAction() {
        this.searchGroupForm.patchValue({
            code: '',
            name: '',
            role: [],
            status: '',
        });
        this.visibleSearchGroupDialog = true;
    }

    hideSearchPopupAction() {
        this.searchGroupForm.patchValue({
            code: '',
            name: '',
            role: [],
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
        this.addGroupForm.patchValue({
            code: '',
            name: '',
            remarks: '',
            role: [],
            status: 'Active',
        });
        this.addGroupForm.markAsUntouched();
        this.visibleAddGroupDialog = true;
    }

    hideAddGroupPopupAction() {
        this.addGroupForm.patchValue({
            code: '',
            name: '',
            remarks: '',
            role: [],
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
            role: [],
            remarks: '',
        });
        this.updateGroupForm.markAsUntouched();
        this.visibleUpdateGroupDialog = true;
    }

    hideUpdateGroupPopupAction() {
        this.visibleUpdateGroupDialog = false;
    }

    onItemDeleteAction(data: any) {
        this.confirmationService.confirm({
            message: 'Are you sure that you want to perform this action?',
            accept: () => {
                //Actual logic to perform a confirmation
                this.deleteGroup(data.id);
            }
        });
    }

}
