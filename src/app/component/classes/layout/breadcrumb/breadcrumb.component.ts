import {Component, OnInit} from '@angular/core';
import {AppService} from "../../../../service/app.service";
import {Router} from "@angular/router";

@Component({
	selector: 'breadcrumb-component',
	templateUrl: '../../../templates/layout/breadcrumb/breadcrumb.component.html',
	styleUrls: ['../../../styles/layout/breadcrumb/breadcrumb.component.less']
})
export class BreadcrumbComponent implements OnInit {
	
	title: string = '';
	description: string = '';
	breadcrumbs: any[] = [];
	currentRouteUrl: string = '';
	
	constructor(public appService: AppService, private router: Router) {
		this.currentRouteUrl = this.router.url;
	}
	
	ngOnInit(): void {
		this.getPageTitle();
	}
	
	getCurrentBreadcrumb() {
		const currentRoute = this.appService.getRoutes()
			.find((route: any) => route.route == this.currentRouteUrl);
	    this.breadcrumbs.push(currentRoute);
	}
	
	getPageTitle() {
		switch (this.currentRouteUrl) {
			case '/home':
				this.title = 'Home';
				this.description = 'Hello Umar, Welcome back!';
				break;
		}
	}
	
}
