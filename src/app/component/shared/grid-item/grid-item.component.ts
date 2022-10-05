import {Component, Input, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";

@Component({
    selector: 'grid-item-component',
    templateUrl: './grid-item.template.html',
    styleUrls: ['./grid-item.component.less']
})
export class GridItemComponent implements OnInit {

    @Input() menuItem: MenuItem[] = [];
    @Input() gridItem: any;

    constructor() {
    }

    ngOnInit(): void {
    }

}
