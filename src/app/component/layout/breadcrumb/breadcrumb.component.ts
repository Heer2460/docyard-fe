import {Component, Input, OnInit} from '@angular/core';
import {AppService} from "../../../service/app.service";
import {NavigationEnd, Router} from "@angular/router";

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
    breadcrumbObj: any = [
        {
            label: 'Home',
            route: '/home',
            slug: 'home',
            active: false,
        },
        {
            label: 'Document Library',
            route: '/doc-lib',
            slug: 'doc-lib',
            active: false,
        },
        {
            label: 'Setting',
            route: '/setting',
            slug: 'setting',
            active: false,
        },
        {
            label: 'User Management',
            route: '/setting/um',
            slug: 'um',
            active: false,
        },
        {
            label: 'User',
            route: '/setting/um/user',
            slug: 'user',
            active: false,
        },
        {
            label: 'Reference',
            route: '/setting/ref',
            slug: 'ref',
            active: false,
        },
        {
            label: 'Department',
            route: '/setting/ref/dept',
            slug: 'dept',
            active: false,
        },
        {
            label: 'Role',
            route: '/setting/um/role',
            slug: 'role',
            active: false,
        },
        {
            label: 'Add',
            route: '',
            slug: 'add',
            active: false,
        },
        {
            label: 'Edit',
            route: '',
            slug: 'edit',
            active: false,
        },
    ];

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
<<<<<<< HEAD
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
=======
        const routesArray = this.currentRouteUrl.split('/');
    
        if(this.currentRouteUrl == '/home') {
            this.title = this.breadcrumbObj[0].label;
            this.description = 'Hello User, Welcome back!';
            this.titleAndDescOnly = true;
            return;
>>>>>>> 29de2b02bb84394ac62967234b5638bf19166e5d
        }
        
        for(const route of routesArray) {
            const breadcrumbItem = this.breadcrumbObj.find((item: any) => {
                if(item.slug == route) {
                    return item;
                }
            });
            if(breadcrumbItem) {
                this.breadcrumbs.push(breadcrumbItem);
            }
        }
        
        this.breadcrumbs = [this.breadcrumbObj[0], ...this.breadcrumbs];
        this.title = this.breadcrumbs[this.breadcrumbs.length-1].label;
        this.breadcrumbs[this.breadcrumbs.length-1].active = true;

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
