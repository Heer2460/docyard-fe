import {Component, Input, OnInit} from '@angular/core';
import {AppService} from "../../../service/app.service";
import {NavigationEnd, Router} from "@angular/router";

@Component({
    selector: 'breadcrumb-component',
    templateUrl: './breadcrumb.template.html',
    styleUrls: ['./breadcrumb.component.less']
})
export class BreadcrumbComponent implements OnInit {

    title: string = '';
    description: string = '';
    breadcrumbs: any[] = [];
    currentRouteUrl: string = '';
    titleAndDescOnly: boolean = false;
    showGridDisplay: boolean = false;
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
            label: 'Settings',
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
            route: '/setting/ref/department',
            slug: 'department',
            active: false,
        },
        {
            label: 'Role',
            route: '/setting/um/role',
            slug: 'role',
            active: false,
        },
        {
            label: 'Group',
            route: '/setting/um/group',
            slug: 'group',
            active: false,
        },
        {
            label: 'Profile',
            route: '/profile',
            slug: 'profile',
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
        {
            label: 'View',
            route: '',
            slug: 'view',
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
        this.appService.showGridDisplaySubject.subscribe((value: boolean) => {
            this.showGridDisplay = value;
        });
    }

    setPageTitleAndBreadcrumb() {
        const routesArray = this.currentRouteUrl.split('/');

        if(this.currentRouteUrl == '/home') {
            this.title = this.breadcrumbObj[0].label;
            this.description = 'Hello User, Welcome back!';
            this.titleAndDescOnly = true;
        } else {
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

    }

    setGridDisplay() {
        this.appService.setGridDisplaySubjectState(true);
    }

    setListDisplay() {
        this.appService.setGridDisplaySubjectState(false);
    }

}
