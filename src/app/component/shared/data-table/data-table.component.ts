import {Component, Input, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";
import {AppService} from "../../../service/app.service";

@Component({
    selector: 'data-table-component',
    templateUrl: './data-table.component.html',
    styleUrls: ['./data-table.component.less']
})
export class DataTableComponent implements OnInit {
    
    @Input() dataRows: any[] = [];
    @Input() actionItems: MenuItem[] = [];
    isGridDisplay: boolean = false;
    
    constructor(public appService: AppService) {
    }
    
    ngOnInit(): void {
        this.appService.isGridDisplaySubject.subscribe((value: boolean) => {
            this.isGridDisplay = value;
        });
    }
    
    onRowSelected(event: any) {
    }
    
    onRowUnSelected(event: any) {
    }
    
}
