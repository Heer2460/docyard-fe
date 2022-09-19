import {Component, Input, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";
import {AppService} from "../../../service/app.service";
import {Router} from "@angular/router";

@Component({
    selector: 'data-table-component',
    templateUrl: './doc-data-table.template.html',
    styleUrls: ['./doc-data-table.component.less']
})
export class DocDataTableComponent implements OnInit {
    
    @Input() dataRows: any[] = [];
    @Input() actionItems: MenuItem[] = [];
    isGridDisplay: boolean = false;
    
    constructor(public appService: AppService, private router: Router) {
    }
    
    ngOnInit(): void {
        this.appService.isGridDisplaySubject.subscribe((value: boolean) => {
            this.isGridDisplay = value;
        });
    }
    
    imageNameClickAction(item: any) {
        this.router.navigate(['/doc-lib/preview', {fileUrl: item.fileUrl}])
    }
    
}
