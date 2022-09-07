import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {RoutesDTO} from "../model/routes.dto";
import {AppConstants} from "../util/app.constants";

@Injectable({
	providedIn: 'root'
})
export class AppService {

	permissions: any = [];
	
	public toggleMenuBSubject = new BehaviorSubject(false);
	public toggleRightPaneSubject = new BehaviorSubject(false);
	public toggleDocInfoPaneSubject = new BehaviorSubject(false);
	public isGridDisplaySubject = new BehaviorSubject(false);
	routes: RoutesDTO[] = [];
	
	appRoutes: RoutesDTO[] = [
		{
			label: 'Home',
			route: '/home',
			icon: 'icon-home',
		},
		{
			label: 'Document Library',
			route: '/doc-lib',
			icon: 'icon-cloud',
		},
		{
			label: 'Shared by Me',
			route: '/shared-by-me',
			icon: 'icon-shared-by-me',
		},
		{
			label: 'Shared with Me',
			route: '/shared-with-me',
			icon: 'icon-shared-with-me',
		},
		{
			label: 'Favourite',
			route: '/favourite',
			icon: 'icon-star',
		},
		{
			label: 'Trash',
			route: '/trash',
			icon: 'icon-trash',
		},
	];
	settingRoutes: RoutesDTO[] = [
		{
			label: 'Home',
			route: '/home',
			icon: 'icon-home',
		},
		{
			label: 'User Management',
			route: '/um',
			icon: 'icon-um',
			children: [
				{
					label: 'User',
					route: '/setting/user',
					icon: 'icon-users',
				},
				{
					label: 'Role',
					route: '/setting/role',
					icon: 'icon-role',
				},
				{
					label: 'Group',
					route: '/setting/group',
					icon: 'icon-group',
				},
				{
					label: 'Assign Permission',
					route: '/setting/ap',
					icon: 'icon-permission',
				},
			]
		}
	];
	
	constructor(private toastService: ToastrService, private router: Router) {
	}
	
	setRoutes(routes: RoutesDTO[]) {
		localStorage.removeItem(AppConstants.APP_ROUTES);
		localStorage.setItem(AppConstants.APP_ROUTES, JSON.stringify(routes));
	}
	
	getRoutes() {
		const routes: any = localStorage.getItem(AppConstants.APP_ROUTES)
		return JSON.parse(routes);
	}
	
	setToggleMenuBSubject(state: boolean) {
		this.toggleMenuBSubject.next(state);
	}
	
	setToggleRightPaneSubject(state: boolean) {
		this.toggleRightPaneSubject.next(state);
	}
	
	setToggleDocInfoPaneSubject(state: boolean) {
		this.toggleDocInfoPaneSubject.next(state);
	}
	
	setGridDisplaySubject(state: boolean) {
		this.isGridDisplaySubject.next(state);
	}

	handleError(error: any, title: string, fromLogin?: boolean) {
		if (error.status === 400) {
			this.toastService.error(error.error.message, title);
		} else if (error.status === 404) {
			this.toastService.error(error.error.message, title);
		} else if (error.status === 401) {
			this.tokenExpired(error.error.error, fromLogin);
		} else if (error.status === 406) {
			this.tokenExpired(error.error.error, fromLogin);
		} else if (error.status === 409) {
			this.toastService.error(error.error.message, title);
		} else if (error.status === 423) {
			this.toastService.error('User is locked due to multiple unsuccessful login attempts, please contact administrator.', title);
		} else if (error.status === 203) {
			this.toastService.error(error.error.message, title);
		} else {
			this.toastService.error(error.error.message, title);
		}
	}

	tokenExpired(response: string, fromLogout?: boolean) {
		if (response === 'invalid_token') {
			localStorage.removeItem(window.btoa('access_token'));
			localStorage.removeItem(window.btoa('refresh_token'));
			localStorage.removeItem(window.btoa('expire_in'));

			if (fromLogout && !fromLogout) {
				this.toastService.info('Your session has been expired.', 'Session Expired');
			}
			this.router.navigate(['/auth/login']);
		}
	}
}
