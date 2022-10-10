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

    @Input() selectedDocId: any = null;

    documentMeta: any;
    users: any[] = [];
    showDocInfoPane: boolean = true;
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
        if (this.selectedDocId && this.selectedDocId > 0) {
            this.requestsService.getRequest(ApiUrlConstants.DL_DOCUMENT_API_URL
                .replace("{dlDocumentId}", String(this.selectedDocId)))
                .subscribe({
                    next: (response: HttpResponse<any>) => {
                        if (response.status === 200) {
                            this.documentMeta = response.body.data;
                            this.populatePane(response.body.data);
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

    populatePane(data: any) {
        this.paneData = {
            title: data?.title,
            savedIn: data?.location,
            size: data?.size,
            modified: data?.updatedOn,
            type: data?.extention,
            description: data?.description,
            currentVersion: data?.currentVersion,
            createdByName: data?.createdByName,
            updatedByName: data?.updatedByName,
        };
        this.comments = data?.dlDocumentCommentDTOList;
    }

    toggleDocInfoPane() {
        this.appService.setDocInfoPaneSubjectState(!this.showDocInfoPane);
    }

    toggleShowAllAction() {
        this.showAll = !this.showAll;
    }

}
