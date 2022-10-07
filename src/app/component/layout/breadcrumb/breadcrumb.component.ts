import {Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";


@Component({
    selector: 'breadcrumb-component',
    templateUrl: './breadcrumb.template.html',
    styleUrls: ['./breadcrumb.component.less']
})
export class BreadcrumbComponent implements OnInit {
    
    @Input() breadcrumbs: any[] = [];
    
    constructor(private router: Router) {
    }
    
    ngOnInit(): void {
    
    }
    
    navigateToRoute(breadcrumb: any) {
        this.router.navigate([breadcrumb.route]);
    }
    
}
