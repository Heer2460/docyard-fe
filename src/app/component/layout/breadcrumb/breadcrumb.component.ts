import {Component, Input, OnInit} from '@angular/core';
import {AppService} from "../../../service/app.service";
import {NavigationEnd, Router} from "@angular/router";
import {AppBreadcrumbConstants} from "../../../util/app.breadcrumb.constants";

@Component({
    selector: 'breadcrumb-component',
    templateUrl: './breadcrumb.component.html',
    styleUrls: ['./breadcrumb.component.less']
})
export class BreadcrumbComponent implements OnInit {

    title: string = '';
    description: string = '';
    breadcrumbs: any[] = [];
    currentRouteUrl: string = '';
    titleAndDescOnly: boolean = false;
    isGridDisplay: boolean = false;
    appBreadcrumbs: any = AppBreadcrumbConstants;

    @Input() showDisplayButtons: boolean = false;

    constructor(public appService: AppService, private router: Router) {
        router.events.subscribe((route: any) => {
            if (route instanceof NavigationEnd) {
                this.currentRouteUrl = this.router.url;
                this.setPageTitleAndBreadcrumb();
            }
        });
    }

    ngOnInit(): void {
    }

    setPageTitleAndBreadcrumb() {
        switch (this.currentRouteUrl) {
            case '/home':
                this.title = this.appBreadcrumbs.home.title;
                this.description = 'Hello User, Welcome back!';
                this.titleAndDescOnly = true;
                break;
            case '/doc-lib':
                this.title = this.appBreadcrumbs.docLib.title;
                this.breadcrumbs = [...this.appBreadcrumbs.docLib.breadCrumb];
                break;
            case '/setting':
                this.title = this.appBreadcrumbs.setting.title;
                this.breadcrumbs = [...this.appBreadcrumbs.setting.breadCrumb];
                break;
            case '/setting/um':
                this.title = this.appBreadcrumbs.um.title;
                this.breadcrumbs = [...this.appBreadcrumbs.um.breadCrumb];
                break;
            case '/setting/um/user':
                this.title = this.appBreadcrumbs.user.title;
                this.breadcrumbs = [...this.appBreadcrumbs.user.breadCrumb];
                break;
            case '/setting/um/user/add':
                this.title = this.appBreadcrumbs.addUser.title;
                this.breadcrumbs = [...this.appBreadcrumbs.addUser.breadCrumb];
                break;
            case '/setting/um/group':
                this.title = this.appBreadcrumbs.group.title;
                this.breadcrumbs = [...this.appBreadcrumbs.group.breadCrumb];
                break;
            case '/setting/ref':
                this.title = this.appBreadcrumbs.ref.title;
                this.breadcrumbs = [...this.appBreadcrumbs.ref.breadCrumb];
                break;
            case '/setting/ref/dept':
                this.title = this.appBreadcrumbs.dept.title;
                this.breadcrumbs = [...this.appBreadcrumbs.dept.breadCrumb];
                break;
            case '/setting/ref/dept/add':
                this.title = this.appBreadcrumbs.addDept.title;
                this.breadcrumbs = [...this.appBreadcrumbs.addDept.breadCrumb];
                break;
            case '/setting/theme':
                this.title = this.appBreadcrumbs.theme.title;
                this.breadcrumbs = [...this.appBreadcrumbs.theme.breadCrumb];
                break;
            case '/setting/um/role':
                this.title = this.appBreadcrumbs.role.title;
                this.breadcrumbs = [...this.appBreadcrumbs.role.breadCrumb];
                break;
            default:
                if (this.currentRouteUrl.indexOf('/setting/ref/dept/edit') > -1) {
                    this.title = this.appBreadcrumbs.editDept.title;
                    this.breadcrumbs = [...this.appBreadcrumbs.editDept.breadCrumb];
                }
                break;
        }

    }

    setGridDisplay() {
        this.isGridDisplay = true;
        this.appService.setGridDisplaySubject(this.isGridDisplay);
    }

    setListDisplay() {
        this.isGridDisplay = false;
        this.appService.setGridDisplaySubject(this.isGridDisplay);
    }

}
