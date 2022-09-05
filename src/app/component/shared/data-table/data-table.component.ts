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
    
    constructor(public appService: AppService) {}
    
    ngOnInit(): void {
    }
    
    onRowSelected(event: any) {
        event.data.selected = true;
        this.appService.setDocInfoPaneSubjectState(event.data);
    }
    
    onRowUnSelected(event: any) {
        event.data.selected = false;
        this.appService.setDocInfoPaneSubjectState(null);
    }
    
}
