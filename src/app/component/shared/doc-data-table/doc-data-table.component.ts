import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MenuItem} from "primeng/api";
import {AppService} from "../../../service/app.service";
import {Router} from "@angular/router";
import {AppConstants} from "../../../util/app.constants";
import {ApiUrlConstants} from "../../../util/api.url.constants";
import {HttpResponse} from "@angular/common/http";
import {RequestService} from "../../../service/request.service";

@Component({
    selector: 'data-table-component',
    templateUrl: './doc-data-table.template.html',
    styleUrls: ['./doc-data-table.component.less']
})
export class DocDataTableComponent implements OnInit {

    @Input() dlDocuments: any[] = [];
    @Input() actionItems: MenuItem[] = [];
    @Output() openFolderEmitter = new EventEmitter<number>();

    showGridDisplay: boolean = false;
    validExtensions: string[] = AppConstants.VALID_EXTENSIONS;
    selectedDocumentId: any = 0;
    
    constructor(public appService: AppService, private router: Router,
                private requestsService: RequestService) {
    }

    ngOnInit(): void {
    }

    openFolder(rowData: any) {
        this.openFolderEmitter.emit(rowData);
        this.selectedDocumentId = rowData.id;

    }

    favouriteDocument(event: any, id: any) {
        const isChecked = event.target.checked;
        let url = ApiUrlConstants.DL_DOCUMENT_API_URL.replace("{dlDocumentId}", String(id)) + '/?favourite=' + isChecked;
        this.requestsService.putRequest(url, {})
            .subscribe({
                    next: (response: HttpResponse<any>) => {
                        if (response.status === 200) {
                            this.appService.successUpdateMessage('Document');
                        }
                    },
                    error: (error: any) => {
                        this.appService.handleError(error, 'Document');
                    }
                }
            );

    }
}
