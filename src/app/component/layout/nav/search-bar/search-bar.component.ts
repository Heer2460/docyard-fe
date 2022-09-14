import {Component, OnInit} from '@angular/core';

@Component({
	selector: 'search-bar-component',
	templateUrl: './search-bar.template.html',
	styleUrls: ['./search-bar.component.less']
})
export class SearchBarComponent implements OnInit {
	
	searchBarToggle: boolean = false;
	
	constructor() {
	}
	
	ngOnInit(): void {
	}
	
	showSearchBarDialog() {
		this.searchBarToggle = true;
	}
	
	hideSearchBarDialog() {
		this.searchBarToggle = false;
	}
	
}
