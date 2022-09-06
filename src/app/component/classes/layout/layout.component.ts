import {Component, OnInit} from '@angular/core';
import {AppService} from "../../../service/app.service";
import {MenuItem} from "primeng/api";

@Component({
	selector: 'layout-component',
	templateUrl: '../../templates/layout/layout.template.html',
	styleUrls: ['../../styles/layout/layout.component.less']
})
export class LayoutComponent implements OnInit {
	
	toggleMenuState: boolean = false;
	toggleRightPaneState: boolean = false;
	docInfoPane: boolean = false;
	
	constructor(public appService: AppService) {
	}
	
	ngOnInit(): void {
		this.appService.toggleMenuBSubject.subscribe((value: boolean) => {
			this.toggleMenuState = value;
		});
		
		this.appService.toggleRightPaneSubject.subscribe((value: boolean) => {
			this.toggleRightPaneState = value;
		});
		
		this.appService.toggleDocInfoPaneSubject.subscribe((value: boolean) => {
			this.docInfoPane = value;
		});
	}
	
}
