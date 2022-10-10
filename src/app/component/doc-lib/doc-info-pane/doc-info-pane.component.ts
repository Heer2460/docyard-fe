import {Component, Input, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import {AppService} from "../../../service/app.service";
import {ApiUrlConstants} from "../../../util/api.url.constants";
import {HttpResponse} from "@angular/common/http";
import {FormBuilder, FormGroup} from "@angular/forms";
import {AppUtility} from "../../../util/app.utility";
import {RequestService} from "../../../service/request.service";

@Component({
    selector: 'doc-info-pane-component',
    templateUrl: './doc-info-pane.template.html',
    styleUrls: ['./doc-info-pane.component.less']
})
export class DocInfoPaneComponent implements OnInit, OnChanges {

    @Input() selectedDoc: any = null;

    documentMeta: any;
    users: any[] = [];
    showDocInfoPane: boolean = false;
    showAll: boolean = false;
    paneData: any;
    comments: any = [];

    constructor(public appService: AppService,
                private requestsService: RequestService,
                private fb: FormBuilder) {
        this.appService.showDocInfoPaneSubject.subscribe((value: boolean) => {
            this.showDocInfoPane = value;
        });
    }

    ngOnChanges(): void {
        this.getMetaDocumentByID();
    }

    ngOnInit(): void {

    }

    getMetaDocumentByID() {
        if (this.selectedDoc && this.selectedDoc > 0) {
            this.requestsService.getRequest(ApiUrlConstants.DL_DOCUMENT_API_URL
                .replace("{dlDocumentId}", String(this.selectedDoc)))
                .subscribe({
                    next: (response: HttpResponse<any>) => {
                        if (response.status === 200) {
                            this.documentMeta = response.body.data;
                        } else {
                            this.documentMeta = [];
                        }
                    },
                    error: (error: any) => {
                        this.appService.handleError(error, 'Document Library');
                    }
                });
        }
    }

    getUserName(id: any) {
        if (id != null) {
            return this.users.find(item => item.id == id)?.username;
        }
    }

    toggleDocInfoPane() {
        this.appService.setShowDocInfoPaneSubjectState(!this.showDocInfoPane);
    }

    toggleShowAllAction() {
        this.showAll = !this.showAll;
    }

}
