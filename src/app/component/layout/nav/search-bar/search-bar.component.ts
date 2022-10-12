import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
	selector: 'search-bar-component',
	templateUrl: './search-bar.template.html',
	styleUrls: ['./search-bar.component.less']
})
export class SearchBarComponent implements OnInit {
	
	searchBarToggle: boolean = false;
	
	constructor(private router: Router) {
	}
	
	ngOnInit(): void {
	}
	
	showSearchBarDialog() {
		this.searchBarToggle = true;
	}
	
	hideSearchBarDialog() {
		this.searchBarToggle = false;
	}

	navigateToSearch(event: any) {
		let searchValue = event.target.value;
		if (searchValue) {
			this.router.navigate(['/search'], { queryParams: { value: searchValue } });
		}
	}
}
