import {Component, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";

@Component({
	selector: 'notification-component',
	templateUrl: './notification.component.html',
	styleUrls: ['./notification.component.less']
})
export class NotificationComponent implements OnInit {
	
	items: MenuItem[] = [
		{
			label: 'Drive is full please upgrade',
			icon: 'icon-bell',
			command: () => {
			}
		},
		{separator: true},
		{
			label: 'Upload finished!',
			icon: 'icon-bell',
			command: () => {
			}
		}
	];
	
	constructor() {
	}
	
	ngOnInit(): void {
	}
	
}
