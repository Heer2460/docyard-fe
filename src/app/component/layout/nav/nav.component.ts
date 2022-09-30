import {Component, Input, OnInit} from '@angular/core';
import {AppService} from "../../../service/app.service";
import {MenuItem} from "primeng/api";

@Component({
	selector: 'nav-component',
	templateUrl: './nav.template.html',
	styleUrls: ['./nav.component.less']
})
export class NavComponent implements OnInit {
	
	toggleMenuState: boolean = false;
	toggleRightPaneStatus: boolean = false;
	
	@Input() showImageViewSettings: boolean = false;
	
	constructor(public appService: AppService) {
	}
	
	ngOnInit(): void {
		this.appService.toggleMenuBSubject.subscribe((value: boolean) => {
			this.toggleMenuState = value;
		});
		this.appService.toggleRightPaneSubject.subscribe((value: boolean) => {
			this.toggleRightPaneStatus = value;
		});
	}
	
	setToggleMenuState() {
		this.toggleMenuState = !this.toggleMenuState;
		this.appService.setToggleMenuBSubject(this.toggleMenuState);
	}
	
	setToggleRightPaneState() {
		this.toggleRightPaneStatus = !this.toggleRightPaneStatus;
		this.appService.setToggleRightPaneSubject(this.toggleRightPaneStatus);
	}
	
}
