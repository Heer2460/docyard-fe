import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MenuItem} from "primeng/api";
import {AppService} from "../../../service/app.service";
import {Router} from "@angular/router";

@Component({
    selector: 'data-table-component',
    templateUrl: './doc-data-table.template.html',
    styleUrls: ['./doc-data-table.component.less']
})
export class DocDataTableComponent implements OnInit {

    @Input() dlDocuments: any[] = [];
    @Input() actionItems: MenuItem[] = [];
    @Output() folderEvent = new EventEmitter<any>();
    showGridDisplay: boolean = false;

    constructor(public appService: AppService, private router: Router) {
    }

    ngOnInit(): void {
        this.appService.showGridDisplaySubject.subscribe((value: boolean) => {
            this.showGridDisplay = value;
        });
    }

    imageNameClickAction(item: any) {
        console.log('in img')
        this.router.navigate(['/doc-lib/preview', {fileUrl: item.fileUrl}])
    }

    getChildDirectory(rowData: any) {
        this.folderEvent.emit(rowData.id);
    }
}
