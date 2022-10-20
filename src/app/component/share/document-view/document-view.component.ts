import {Component, OnInit} from '@angular/core';
import {AppConstants} from "../../../util/app.constants";
import {AppService} from "../../../service/app.service";
import {ActivatedRoute, Router} from "@angular/router";
import {RequestService} from "../../../service/request.service";
import {ToastrService} from "ngx-toastr";
import {ApiUrlConstants} from "../../../util/api.url.constants";
import {HttpResponse} from "@angular/common/http";
import {AppUtility} from "../../../util/app.utility";
import * as FileSaver from "file-saver";

@Component({
    selector: 'document-view-component',
    templateUrl: './document-view.component.html',
    styleUrls: ['./document-view.component.less']
})
export class DocumentViewComponent implements OnInit {

    showDocInfoPane: boolean = true;
    defaultZoom: number = 0;
    magnifierZoom: number = this.defaultZoom;
    imageObj: any = null;
    initialWidth: number = 0;
    initialHeight: number = 0;
    dlDocuments: any[] = [];
    selectedDoc: any;
    previewTabs = {
        properties: true,
        comments: false,
        sharing: false,
    };
    validExtensions: string[] = AppConstants.VALID_EXTENSIONS;

    constructor(public appService: AppService,
                private activatedRoute: ActivatedRoute,
                private requestsService: RequestService,
                private router: Router,
                private toastService: ToastrService,) {
        this.appService.setShowDocInfoPaneSubjectState(this.showDocInfoPane);
    }

    ngOnInit(): void {
        this.appService.showDocInfoPaneSubject.subscribe((value: boolean) => {
            this.showDocInfoPane = value;
        });
        this.setInitialProps();
        this.activatedRoute.queryParams.subscribe((params: any) => {
            const guId = params.guid;
            if (guId) {
                this.getDocumentByGuId(guId);
            }
        })
    }

    getDocumentByGuId(guId: string) {
        this.requestsService.getUnAuthRequest(ApiUrlConstants.DL_DOCUMENT_UN_AUTH_FILE_DETAIL_API_URL + guId)
            .subscribe({
                next: (response: HttpResponse<any>) => {
                    if (response.status === 200) {
                        this.selectedDoc = response.body.data;
                    } else {
                        this.selectedDoc = null;
                    }
                },
                error: (error: any) => {
                    this.appService.handleError(error, 'Document Library');
                }
            });
    }

    downloadFile() {
        this.requestsService.getUnAuthRequestFile(ApiUrlConstants.DOWNLOAD_UN_AUTH_DL_DOCUMENT_API_URL.replace("{dlDocumentId}", this.selectedDoc.id))
            .subscribe({
                next: (response: any) => {
                    let mimeType = AppUtility.getMimeTypeByFileName(this.selectedDoc.name);
                    let blob = new Blob([response], {type: mimeType});
                    FileSaver.saveAs(blob, this.selectedDoc.name);
                    this.toastService.success('Document downloaded successfully.', 'Document Library');
                },
                error: (error: any) => {
                    this.appService.handleError(error, 'Document Library');
                }
            });
    }

    magnifierZoomInAction() {
        this.magnifierZoom += 10;
        this.generateStyleObj();
    }

    magnifierZoomOutAction() {
        this.magnifierZoom -= 10;
        this.generateStyleObj();
    }

    setInitialProps() {
        this.imageObj = document.querySelector('.image-container img');
        this.initialWidth = this.imageObj?.clientWidth;
        this.initialHeight = this.imageObj?.clientHeight;
    }

    generateStyleObj() {

        const calcWidth = ((this.initialWidth * this.magnifierZoom) / 100) + this.initialWidth;
        const calcHeight = ((this.initialHeight * this.magnifierZoom) / 100) + this.initialHeight;

        this.imageObj.style.width = `${calcWidth}px`;
        this.imageObj.style.height = `${calcHeight}px`;

    }

    checkValidImageFile() {
        return this.selectedDoc?.mimeType?.split('/')[0] == 'image'
    }

    getValidExtension() {
        return this.validExtensions?.indexOf(this.selectedDoc?.extension) > -1
    }

}
