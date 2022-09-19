import {Component, OnInit} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {RequestService} from "../../../../../service/request.service";
import {AppService} from "../../../../../service/app.service";
import {AppUtility} from "../../../../../util/app.utility";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiUrlConstants} from "../../../../../util/api.url.constants";
import {forkJoin, Subject, takeUntil} from "rxjs";
import {HttpResponse} from "@angular/common/http";
import {GroupDTO} from "../../../../../model/settings/um/group/group.dto";
import {DepartmentDTO} from "../../../../../model/settings/ref/department/department.dto";
import {UserDTO} from "../../../../../model/settings/um/user/user.dto";

@Component({
    selector: 'user-profile-component',
    templateUrl: './view-user.template.html',
    styleUrls: ['./view-user.component.less']
})
export class ViewUserComponent implements OnInit {

    destroy: Subject<boolean> = new Subject();
    userId: any;
    groups: GroupDTO[] = [];
    departments: DepartmentDTO[] = [];
    selectedUser: UserDTO = new UserDTO();

    constructor(private requestsService: RequestService,
                private appService: AppService,
                public appUtility: AppUtility,
                private activeRoute: ActivatedRoute) {
    }

    ngOnInit(): void {
        if (this.activeRoute.snapshot.paramMap.get('id')) {
            this.userId = this.activeRoute.snapshot.paramMap.get('id')
        }
        this.preloadedData();
    }

    preloadedData(): void {
        const groups = this.requestsService.getRequest(ApiUrlConstants.GROUP_API_URL);
        const departments = this.requestsService.getRequest(ApiUrlConstants.DEPARTMENT_API_URL);
        forkJoin([groups, departments])
            .pipe(takeUntil(this.destroy))
            .subscribe(
                {
                    next: (response: HttpResponse<any>[]) => {
                        if (response[0].status === 200) {
                            this.groups = response[0].body.data;
                        }
                        if (response[1].status === 200) {
                            this.departments = response[1].body.data;
                        }
                        if (this.userId) {
                            this.getUserById(this.userId);
                        }
                    },
                    error: (error: any) => {
                        this.appService.handleError(error, 'User');
                    }
                });
    }


    getUserById(id: number) {
        this.requestsService.getRequest(ApiUrlConstants.USER_API_URL + id)
            .subscribe({
                next: (response: HttpResponse<any>) => {
                    if (response.status === 200) {
                        this.selectedUser = response.body.data;
                    }
                }, error: (error: any) => {
                    this.appService.handleError(error, 'User');
                }
            });
    }

    getGroupName(id: any) {
        if (id) {
            return this.groups.find((item: any) => Number(id) === item.id)?.name;
        }
        return '';
    }

    getDepartmentName(id: any) {
        if (id) {
            return this.departments.find((item: any) => Number(id) === item.id)?.name;
        }
        return '';
    }

    ngOnDestroy() {
        this.destroy.next(true);
    }

}
