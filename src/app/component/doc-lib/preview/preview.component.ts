import {Component, OnInit} from '@angular/core';
import {AppService} from "../../../service/app.service";
import {ActivatedRoute} from "@angular/router";
import {ApiUrlConstants} from "../../../util/api.url.constants";
import {HttpResponse} from "@angular/common/http";
import {RequestService} from "../../../service/request.service";
import {AppConstants} from "../../../util/app.constants";
import {ToastrService} from "ngx-toastr";

@Component({
    selector: 'preview-component',
    templateUrl: './preview.template.html',
    styleUrls: ['./preview.component.less'],
})
export class PreviewComponent implements OnInit {
    
    showDocInfoPane: boolean = true;
    defaultZoom: number = 0;
    magnifierZoom: number = this.defaultZoom;
    imageObj: any = null;
    initialWidth: number = 0;
    initialHeight: number = 0;
    stared: boolean = false;
    queryParams: any;
    dlDocuments: any[] = [];
    currentDocIndex: number = 0;
    selectedDoc: any;
    validExtensions: string[] = AppConstants.VALID_EXTENSIONS;
    
    constructor(public appService: AppService,
                private activatedRoute: ActivatedRoute,
                private requestsService: RequestService,
                private toastService: ToastrService,) {
        this.appService.setShowDocInfoPaneSubjectState(this.showDocInfoPane);
    }
    
    ngOnInit(): void {
        this.appService.showDocInfoPaneSubject.subscribe((value: boolean) => {
            this.showDocInfoPane = value;
        });
        this.setInitialProps();
        this.activatedRoute.queryParams.subscribe((params: any) => {
            this.queryParams = params;
            const folderId = this.queryParams.folderId ? this.queryParams.folderId : 0
            this.loadDocumentLibrary(folderId, false);
        })
    }
    
    loadDocumentLibrary(folderId: string, archived: boolean) {
        let loggedInUserId = this.appService.getLoggedInUserId();
        this.requestsService.getRequest(ApiUrlConstants.GET_ALL_DL_DOCUMENT_BY_OWNER_API_URL
            .replace('{ownerId}', String(loggedInUserId))
            .replace("{folderId}", folderId)
            .replace("{archived}", String(archived)))
            .subscribe({
                next: (response: HttpResponse<any>) => {
                    if (response.status === 200) {
                        this.dlDocuments = response.body.data;
                        this.dlDocuments = this.dlDocuments.filter(doc => !doc.folder);
                        this.findCurrentFileFromDocs();
                    } else {
                        this.dlDocuments = [];
                    }
                },
                error: (error: any) => {
                    this.appService.handleError(error, 'Document Library');
                }
            });
    }
    
    favouriteDocument(row: any) {
        const isChecked = !row.favorite;
        let url = ApiUrlConstants.DL_DOCUMENT_API_URL.replace("{dlDocumentId}", String(row.id)) + '/?favourite=' + isChecked;
        this.requestsService.putRequest(url, {})
            .subscribe({
                    next: (response: HttpResponse<any>) => {
                        if (response.status === 200) {
                            if (isChecked) {
                                this.toastService.success(row.title + ' has been starred successfully.', 'Document Library');
                            } else {
                                this.toastService.success(row.title + ' has been un-starred successfully.', 'Document Library');
                            }
                        }
                    },
                    error: (error: any) => {
                        this.appService.handleError(error, 'Document Library');
                    }
                }
            );
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
    
    starFileAction() {
        this.stared = !this.stared;
    }
    
    findCurrentFileFromDocs() {
        this.selectedDoc = this.dlDocuments.find((doc, index) => {
            if (this.queryParams.id == doc.id && doc.folder == false) {
                this.currentDocIndex = index
                return doc;
            }
        });
    }
    
    openPrevFileAction() {
        if(this.currentDocIndex > 0) {
            this.currentDocIndex--;
        }
        this.selectedDoc = this.dlDocuments[this.currentDocIndex];
    }
    
    openNextFileAction() {
        if(this.currentDocIndex < this.dlDocuments.length-1) {
            this.currentDocIndex++;
        }
        this.selectedDoc = this.dlDocuments[this.currentDocIndex];
    }
    
    checkValidImageFile() {
        return this.selectedDoc?.mimeType?.split('/')[0] == 'image'
    }
    
    getValidExtension() {
        return this.validExtensions?.indexOf(this.selectedDoc?.extension) > -1
    }
    
}
