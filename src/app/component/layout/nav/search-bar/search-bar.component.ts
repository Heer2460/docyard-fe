import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
	selector: 'search-bar-component',
	templateUrl: './search-bar.template.html',
	styleUrls: ['./search-bar.component.less']
})
export class SearchBarComponent implements OnInit {

	searchBarToggle: boolean = false;
    isFavoriteChecked: boolean = false;
    isSharedChecked: boolean = false;

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

    favoritesCheckAction() {
        this.isFavoriteChecked = !this.isFavoriteChecked;
        this.router.navigate(['/search'], { queryParams: { value: this.isFavoriteChecked, type:'favorites' } });
    }

    sharedCheckAction() {
        this.isSharedChecked = !this.isSharedChecked;
        this.router.navigate(['/search'], { queryParams: { value: this.isSharedChecked, type:'shared' } });
    }

	navigateToSearch(event: any) {
		let searchValue = event.target.value;
		if (searchValue) {
			this.router.navigate(['/search'], { queryParams: { value: searchValue, type:'search' } });
		}
	}

    navigateToTagSearch(event: any) {
        let searchValue = event.target.value;
        if (searchValue) {
            this.router.navigate(['/search'], { queryParams: { value: searchValue, type:'tag' } });
        }
    }
}
