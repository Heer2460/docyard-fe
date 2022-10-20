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
import {BreadcrumbDTO} from "../../../model/breadcrumb.dto";
import {DlDocumentDTO} from "../../../model/settings/doc-handling/dl-document.dto";

@Component({
    selector: 'folder-view-component',
    templateUrl: './folder-view.component.html',
    styleUrls: ['./folder-view.component.less']
})
export class FolderViewComponent implements OnInit {

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
    dlFolderId: any;
    showGridDisplay: boolean = false;
    breadcrumbs: BreadcrumbDTO[] = [];
    breadcrumbItemsToShow: any = 4;
    breadcrumbCollapsedItems: any[] = [];
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
        this.activatedRoute.queryParams.subscribe((params: any) => {
            if (params.id) {
                const folderId = window.atob(params.id);
                this.dlFolderId = folderId;
                this.getFolderById(folderId);
            }
        })
        this.breadcrumbs = this.getBreadCrumbsFromLocalStorage();
        this.updateCollapsedBreadcrumbItems();
    }

    // breadcrumb code start
    updateBreadcrumb(rowData: any) {
        this.breadcrumbs[this.breadcrumbs.length - 1].active = false;
        this.breadcrumbs.push({
            label: rowData.title,
            id: rowData.id,
            active: true
        });
        this.setBreadcrumbAndSelectedItemToLocalStorage();
    }

    updateCollapsedBreadcrumbItems() {
        if (this.breadcrumbs.length < this.breadcrumbItemsToShow) return;

        if (this.breadcrumbs.length > this.breadcrumbItemsToShow) {
            this.breadcrumbCollapsedItems = this.breadcrumbs.slice(0, this.breadcrumbs.length - this.breadcrumbItemsToShow);
            this.breadcrumbCollapsedItems = this.breadcrumbCollapsedItems.map((item: BreadcrumbDTO, index: number) => ({
                label: item.label,
                command: () => this.navigateToRoute(item, index)
            }))
        }
    }

    navigateToRoute(breadcrumb: BreadcrumbDTO, index: number) {
        if (breadcrumb.id) {
            this.getFolderById(breadcrumb.id);
            this.breadcrumbs.pop();
        } else if (index == 1) {
            this.getFolderById(this.dlFolderId);
        } else {
            this.router.navigate([breadcrumb.route]);
        }

        this.breadcrumbs = this.breadcrumbs.slice(0, index + 1);
        this.breadcrumbs[this.breadcrumbs.length - 1].active = true;
        this.setBreadcrumbAndSelectedItemToLocalStorage();
    }

    getBreadCrumbsFromLocalStorage(): BreadcrumbDTO[] {
        return [
            {
                label: 'Home',
                route: '/home',
                active: false
            }
        ];
    }

    setBreadcrumbAndSelectedItemToLocalStorage() {
        this.updateCollapsedBreadcrumbItems();
        localStorage.setItem(window.btoa(AppConstants.SELECTED_SHARED_FOLDER_ID), this.dlFolderId);
        localStorage.setItem(window.btoa(AppConstants.SELECTED_SHARED_FOLDER_BREADCRUMB), JSON.stringify(this.breadcrumbs));
    }

    setGridDisplay() {
        this.showGridDisplay = true;
    }

    setListDisplay() {
        this.showGridDisplay = false;
    }

    openFolder(rowData: any) {
        this.dlFolderId = rowData.id;
        if (this.dlFolderId != '') {
            this.getFolderById(this.dlFolderId);
            this.updateBreadcrumb(rowData);
        }
    }

    openFile(rowData: any) {
        if (rowData.parentId == null) {
            rowData.parentId = '';
        }
        window.open(`/share/document-view?guid=${rowData.versionGUId}`, '_blank');
    }

    onRowSelect(event: any) {
        this.selectedDoc = event.data;
        this.appService.setShowDocInfoPaneSubjectState(true);
    }

    onRowUnselect(event: any) {
        this.selectedDoc = new DlDocumentDTO();
        this.appService.setShowDocInfoPaneSubjectState(false);
    }

    getFolderById(folderId: any) {
        this.requestsService.getUnAuthRequest(ApiUrlConstants.DL_DOCUMENT_UN_AUTH_FOLDER_DETAIL_API_URL.replace('{folderId}', folderId))
            .subscribe({
                next: (response: HttpResponse<any>) => {
                    if (response.status === 200) {
                        this.dlDocuments = response.body.data;
                    } else {
                        this.dlDocuments = [];
                    }
                },
                error: (error: any) => {
                    this.appService.handleError(error, 'Document Library');
                }
            });
    }

    downloadFile() {
        this.requestsService.getRequestFile(ApiUrlConstants.DOWNLOAD_DL_DOCUMENT_API_URL.replace("{dlDocumentId}", this.selectedDoc.id))
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

    checkValidImageFile() {
        return this.selectedDoc?.mimeType?.split('/')[0] == 'image'
    }

    getValidExtension() {
        return this.validExtensions?.indexOf(this.selectedDoc?.extension) > -1
    }

    ngOnDestroy(): void {
        localStorage.removeItem(window.btoa(AppConstants.SELECTED_SHARED_FOLDER_ID));
        localStorage.removeItem(window.btoa(AppConstants.SELECTED_SHARED_FOLDER_BREADCRUMB));
    }

}
