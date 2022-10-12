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
		console.log(event.target.value);
		this.router.navigate(['/search']);
	}
}
