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

@Component({
    selector: 'add-role-component',
    templateUrl: './add-role.template.html',
    styleUrls: ['./add-role.component.less']
})
export class AddRoleComponent implements OnInit {

    addRoleForm: FormGroup = new FormGroup({});
    statuses = ReferencesStatuses.statuses;
    permissions: any = [];

    constructor(private router: Router, private confirmationService: ConfirmationService,
                private fb: FormBuilder, private requestsService: RequestService,
                private appService: AppService, public appUtility: AppUtility) {
    }

    ngOnInit(): void {
        this.preLoadedData();
        this.buildForms();
    }

    preLoadedData() {
        this.requestsService.getRequest(ApiUrlConstants.PERMISSIONS_API_URL)
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
            remarks: ['', Validators.maxLength(256)]
        });
    }

    createRole() {
        if (this.addRoleForm.invalid) {
            return;
        }
        // if (this.files.length < 1) {
        //     this.toastService.error('Profile picture is missing.', 'Logo');
        //     return;
        // }
        let roleDTO: RoleDTO = new RoleDTO();
        roleDTO = roleDTO.convertToNewDTO(this.addRoleForm.value);
        if (roleDTO) {
            this.requestsService.postRequest(ApiUrlConstants.ROLE_API_URL, roleDTO)
                .subscribe({
                    next: (response: HttpResponse<any>) => {
                        if (response.status === 200) {
                            this.appService.successAddMessage('Role');
                            this.router.navigate(['setting/um/role']);
                        }
                    },
                    error: (error: any) => {
                        this.appService.handleError(error, 'Role');
                    }
                });
        }
    }

}
