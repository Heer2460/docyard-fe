import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MenuItem} from "primeng/api";
import {AppService} from "../../../service/app.service";
import {Router} from "@angular/router";
import {AppConstants} from "../../../util/app.constants";

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
    validExtensions: string[] = AppConstants.VALID_EXTENSIONS;
    selectedDocumentId: any = 0;

    constructor(public appService: AppService, private router: Router) {
    }

    ngOnInit(): void {
        this.appService.showGridDisplaySubject.subscribe((value: boolean) => {
            this.showGridDisplay = value;
        });
    }

    imageNameClickAction(item: any) {
        this.router.navigate(['/doc-lib/preview', {fileUrl: item.fileUrl}])
    }
    
    itemNameClickAction(item: any) {
        console.log(item);
    }

    getChildDirectory(rowData: any) {
        console.log(this.dlDocuments);
        console.log(rowData);
        this.selectedDocumentId = rowData.id;
        this.folderEvent.emit(rowData.id);

    }
}
