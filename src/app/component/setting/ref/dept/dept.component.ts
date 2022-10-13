import {HttpResponse} from "@angular/common/http";
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {ConfirmationService, MenuItem} from "primeng/api";
import {DepartmentDTO} from "../../../../model/settings/ref/department/department.dto";
import {AppService} from "../../../../service/app.service";
import {RequestService} from "../../../../service/request.service";
import {ApiUrlConstants} from "../../../../util/api.url.constants";
import {AppUtility} from "../../../../util/app.utility";
import {ReferencesStatuses} from "../../../../util/references.statuses";
import {RoleActionConstants} from "../../../../util/role.actions.constants";
import {BreadcrumbDTO} from "../../../../model/breadcrumb.dto";

@Component({
    selector: 'dept-component',
    templateUrl: './dept.template.html',
    styleUrls: ['./dept.component.less']
})
export class DeptComponent implements OnInit {

    addDepartmentForm: FormGroup = new FormGroup({});
    updateDepartmentForm: FormGroup = new FormGroup({});
    searchDepartmentForm: FormGroup = new FormGroup({});
    departments: any[] = [];
    message: string = 'Click search to view departments.';
    searchDialog: boolean = false;
    addDialog: boolean = false;
    updateDialog: boolean = false;
    viewDialog: boolean = false;
    roleActions = RoleActionConstants;
    statuses = ReferencesStatuses.statuses;
    selectedDepartment: DepartmentDTO = new DepartmentDTO();
    confirmationHeader: string = "Delete Department";

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
            label: 'Reference',
            active: false
        },
        {
            label: 'Department',
            route: '/setting/ref/department',
            active: true
        }
    ];

    title: string = 'Department';

    actionItems: MenuItem[] = [
        {
            label: 'View',
            icon: 'icon-eye',
            visible: this.roleActions.DEPT_VIEW.value,
            command: () => this.onViewOptionSelected(this.selectedDepartment)
        },
        {
            label: 'Edit',
            icon: 'icon-edit',
            visible: this.roleActions.DEPT_EDIT.value,
            command: () => this.onEditOptionSelected(this.selectedDepartment)
        },
        {
            label: 'Delete',
            icon: 'icon-trash',
            visible: this.roleActions.DEPT_DEL.value,
            command: () => this.onItemDeleteAction(this.selectedDepartment)
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
        this.searchDepartmentForm = this.fb.group({
            code: ['',  Validators.pattern(/^[a-zA-Z0-9_-]*$/)],
            name: ['',  Validators.pattern(/^[a-zA-Z0-9\s_-]*$/)],
            status: [''],
        });

        this.addDepartmentForm = this.fb.group({
            code: [null, [Validators.required, Validators.maxLength(17), Validators.pattern(/^[a-zA-Z0-9]*$/)]],
            name: [null, [Validators.required, Validators.maxLength(50), Validators.pattern(/^[a-zA-Z0-9\s_-]*$/)]],
            status: ['Active'],
        });

        this.updateDepartmentForm = this.fb.group({
            id: [null, Validators.required],
            code: [{ value:null,disabled: true}],
            name: [null, [Validators.required, Validators.maxLength(50), Validators.pattern(/^[a-zA-Z0-9\s_-]*$/)]],
            status: [null, Validators.required],
        });
    }

    searchDepartments() {
        let url = ApiUrlConstants.DEPARTMENT_API_URL + 'search' + '?code=' + this.searchDepartmentForm.value.code +
            '&name=' + this.searchDepartmentForm.value.name + '&status=' + this.searchDepartmentForm.value.status;
        this.requestsService.getRequest(url)
            .subscribe({
                next: (response: HttpResponse<any>) => {
                    if (response.status === 200) {
                        this.departments = response.body.data;
                    } else {
                        this.departments = [];
                        this.message = 'No department found.'
                    }
                    this.hideSearchPopupAction();
                },
                error: (error: any) => {
                    this.appService.handleError(error, 'Department');
                }
            });
    }

    createDepartment() {
        if (this.addDepartmentForm.invalid) {
            return;
        }
        let departmentDTO: DepartmentDTO = new DepartmentDTO();
        departmentDTO = departmentDTO.convertToNewDTO(this.addDepartmentForm.value);
        if (departmentDTO) {
            this.requestsService.postRequest(ApiUrlConstants.DEPARTMENT_API_URL, departmentDTO)
                .subscribe({
                    next: (response: HttpResponse<any>) => {
                        if (response.status === 200) {
                            this.appService.successAddMessage('Department');
                            this.searchDepartments();
                            this.addDialog = false;
                        }
                    },
                    error: (error: any) => {
                        this.appService.handleError(error, 'Department');
                    }
                });
        }
    }

    updateDepartment() {
        if (this.updateDepartmentForm.invalid) {
            return;
        }
        let departmentDTO: DepartmentDTO = new DepartmentDTO();
        departmentDTO.convertToDTO(this.updateDepartmentForm.value);
        if (departmentDTO) {
            this.requestsService.putRequest(ApiUrlConstants.DEPARTMENT_API_URL, departmentDTO)
                .subscribe({
                    next: (response: HttpResponse<any>) => {
                        if (response.status === 200) {
                            this.appService.successUpdateMessage('Department');
                            this.searchDepartments();
                            this.updateDialog = false;
                        }
                    },
                    error: (error: any) => {
                        this.appService.handleError(error, 'Department');
                    }
                });
        }
    }

    deleteDepartment(id: any) {
        if (id) {
            this.requestsService.deleteRequest(ApiUrlConstants.DEPARTMENT_API_URL + id).subscribe({
                next: (response: HttpResponse<any>) => {
                    if (response.status == 200) {
                        this.appService.successDeleteMessage('Department');
                        this.searchDepartments();
                    }
                },
                error: (error: any) => {
                    this.appService.handleError(error, 'Delete Department');
                }
            });
        } else {
            this.toastService.error('Select Item', 'Department');
        }
    }

    onMenuClicked(data: any) {
        this.selectedDepartment = data;
    }

    onViewOptionSelected(data: any) {
        this.showViewPopupAction();
    }

    onEditOptionSelected(data: any) {
        this.showUpdatePopupAction();
        this.updateDepartmentForm.patchValue({
            id: data.id,
            code: data.code,
            name: data.name,
            status: data.status,
        });
    }

    showSearchPopupAction() {
        this.searchDepartmentForm.patchValue({
            code: '',
            name: '',
            status: '',
            roles:''
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
        this.addDepartmentForm.patchValue({
            code: '',
            name: '',
            status: 'Active',
        });
        this.addDepartmentForm.markAsUntouched();
        this.addDialog = true;
    }

    hideAddPopupAction() {
        this.confirmationHeader = "Add Department";
        if(this.addDepartmentForm.dirty){
            this.confirmationService.confirm({
                message: 'Form shall be closed without saving data. Do you want to proceed?',
                accept: () => {
                    //Actual logic to perform a confirmation
                    this.addDialog = false;
                }
            });
        }else{
            this.addDialog = false;
        }

    }

    showUpdatePopupAction() {
        this.updateDepartmentForm.patchValue({
            code: '',
            name: '',
            status: '',
        });
        this.updateDepartmentForm.markAsUntouched();
        this.updateDialog = true;
    }

    hideUpdatePopupAction() {
        this.confirmationHeader = "Update Department";
        if(this.updateDepartmentForm.dirty){
            this.confirmationService.confirm({
                message: 'Form shall be closed without saving data. Do you want to proceed?',
                accept: () => {
                    //Actual logic to perform a confirmation
                    this.updateDialog = false;
                }
            });
        }else{
            this.updateDialog = false;
        }
    }

    onItemDeleteAction(data: any) {
        this.confirmationHeader = "Delete Department";
        if (this.selectedDepartment.status === 'Active') {
            this.toastService.error('Active record cannot be deleted ', 'Department')
        } else {
            this.confirmationService.confirm({
                message: 'Are you sure you want to delete this record?',
                accept: () => {
                    //Actual logic to perform a confirmation
                    this.deleteDepartment(data.id)
                }
            });
        }
    }

    addDepartment() {
        if (!this.roleActions.DEPT_ADD.value) {
            this.appService.noRightsMessage();
            return;
        }
        this.showAddPopupAction();
    }

    searchDepartment() {
        if (!this.roleActions.DEPT_VIEW.value) {
            this.appService.noRightsMessage();
            return;
        }
        this.showSearchPopupAction();
    }

}
