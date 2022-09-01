import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
	providedIn: 'root'
})
export class AppService {
	
	public toggleMenuBSubject = new BehaviorSubject(false);
	public toggleRightPaneSubject = new BehaviorSubject(false);
	routes: any[] = [
		{
			label: 'Home',
			route: '/home',
			icon: 'icon-home',
			active: true
		},
		{
			label: 'Document Library',
			route: '/doc-lib',
			icon: 'icon-cloud',
			active: false
		},
		{
			label: 'Shared by Me',
			route: '/shared-by-me',
			icon: 'icon-shared-by-me',
			active: false
		},
		{
			label: 'Shared with Me',
			route: '/shared-with-me',
			icon: 'icon-shared-with-me',
			active: false
		},
		{
			label: 'Favourite',
			route: '/favourite',
			icon: 'icon-star',
			active: false
		},
		{
			label: 'Trash',
			route: '/trash',
			icon: 'icon-trash',
			active: false
		},
	];
	
	constructor() {
	}
	
	getRoutes() {
		return this.routes;
	}
	
	setToggleMenuBSubject(state: boolean) {
		this.toggleMenuBSubject.next(state);
	}
	
	setToggleRightPaneSubject(state: boolean) {
		this.toggleRightPaneSubject.next(state);
	}
	
}
