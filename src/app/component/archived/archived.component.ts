import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MenuItem} from "primeng/api";
import {AppService} from "../../service/app.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {AppUtility} from "../../util/app.utility";
import {ApiUrlConstants} from "../../util/api.url.constants";
import {HttpResponse} from "@angular/common/http";
import {RequestService} from "../../service/request.service";
import {DlDocumentDTO} from "../../model/settings/doc-handling/dl-document.dto";
import {AppConstants} from "../../util/app.constants";
import {BreadcrumbDTO} from "../../model/breadcrumb.dto";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import * as FileSaver from 'file-saver';

@Component({
    selector: 'archived-component',
    templateUrl: './archived.template.html',
    styleUrls: ['./archived.component.less']
})
export class ArchivedComponent implements OnInit, OnDestroy {

    @ViewChild('shareLinkInput') shareLinkInput: ElementRef | undefined;
    menuItems: MenuItem[] = [];
    dlDocuments: any[] = [];
    selectedDoc: DlDocumentDTO = new DlDocumentDTO();
    showGridDisplay: boolean = false;
    dlFolderId: any;
    validExtensions: string[] = AppConstants.VALID_EXTENSIONS;
    breadcrumbs: BreadcrumbDTO[] = [];
    breadcrumbItemsToShow: any = 4;
    breadcrumbCollapsedItems: any[] = [];
    title: string = 'Archive Docs';
    shareWithUserForm: FormGroup = new FormGroup({});
    createSharedLink: boolean = false;
    departments: any[] = [];
    previewTabs = {
        properties: true,
        comments: true,
        sharing: true,
    };

    constructor(public appService: AppService,
                private router: Router,
                private fb: FormBuilder,
                public appUtility: AppUtility,
                private requestsService: RequestService,
                private toastService: ToastrService) {
    }

    ngOnInit(): void {
        this.appService.setDocInfoPaneState(false);
        this.buildDocumentActions();
        this.loadArchivedDocuments(this.appService.getSWMSelectedFolderId());
        this.breadcrumbs = this.getBreadCrumbsFromLocalStorage();
        this.preloadedData();
    }

    preloadedData(): void {
        this.requestsService.getRequest(ApiUrlConstants.DEPARTMENT_API_URL + 'search?code=&name=&status=Active')
            .subscribe({
                next: (response: HttpResponse<any>) => {
                    if (response.status === 200) {
                        this.departments = response.body.data;
                    } else {
                        this.departments = [];
                    }
                },
                error: (error: any) => {
                    this.appService.handleError(error, 'Department');
                }
            });
    }

    buildDocumentActions() {
        this.menuItems = [
            {
                label: 'Download',
                icon: 'icon-download',
                command: () => {
                }
            }
        ];
    }

    loadArchivedDocuments(folderId: string) {
        let loggedInUserId = this.appService.getLoggedInUserId();
        this.requestsService.getRequest(ApiUrlConstants.GET_ALL_DL_DOCUMENT_BY_OWNER_API_URL
            .replace('{ownerId}', String(loggedInUserId))
            .replace("{folderId}", folderId)
            .replace("{archived}", String(true)))
            .subscribe({
                next: (response: HttpResponse<any>) => {
                    if (response.status === 200) {
                        this.dlDocuments = response.body.data;
                    } else {
                        this.dlDocuments = [];
                    }
                },
                error: (error: any) => {
                    this.appService.handleError(error, 'Archived');
                }
            });
    }

    onMenuClicked(data: DlDocumentDTO) {
        this.selectedDoc = data;

        this.menuItems = [
            {
                label: 'Un-Archive',
                icon: 'icon-download',
                command: () => this.unArchiveDocument(this.selectedDoc)
            }
        ];
    }

    openFolder(rowData: any) {
        this.dlFolderId = rowData.id;
        if (this.dlFolderId != '') {
            this.loadArchivedDocuments(this.dlFolderId);
            this.updateBreadcrumb(rowData);
        }
    }

    openFile(rowData: any) {
        if (rowData.parentId == null) {
            rowData.parentId = '';
        }
        window.open(`/preview?id=${rowData.id}&folderId=${rowData.parentId}&shared=${window.btoa('swm')}`, '_blank');
    }

    setGridDisplay() {
        this.showGridDisplay = true;
    }

    setListDisplay() {
        this.showGridDisplay = false;
    }

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
            this.loadArchivedDocuments(breadcrumb.id);
            this.breadcrumbs.pop();
        } else if (index == 1) {
            this.dlFolderId = '0';
            this.loadArchivedDocuments(this.dlFolderId);
        } else {
            this.router.navigate([breadcrumb.route]);
        }

        this.breadcrumbs = this.breadcrumbs.slice(0, index + 1);
        this.breadcrumbs[this.breadcrumbs.length - 1].active = true;
        this.setBreadcrumbAndSelectedItemToLocalStorage();
    }

    getBreadCrumbsFromLocalStorage(): BreadcrumbDTO[] {
        const breadcrumbs: any = localStorage.getItem(window.btoa(AppConstants.SWM_SELECTED_FOLDER_BREADCRUMB));

        if (breadcrumbs) {
            return JSON.parse(breadcrumbs);
        } else {
            return [
                {
                    label: 'Home',
                    route: '/home',
                    active: false
                },
                {
                    label: 'Archived',
                    route: '/doc-lib',
                    active: true
                }
            ];
        }
    }

    setBreadcrumbAndSelectedItemToLocalStorage() {
        this.updateCollapsedBreadcrumbItems();
        localStorage.setItem(window.btoa(AppConstants.SWM_SELECTED_FOLDER_ID), this.dlFolderId);
        localStorage.setItem(window.btoa(AppConstants.SWM_SELECTED_FOLDER_BREADCRUMB), JSON.stringify(this.breadcrumbs));
    }

    unArchiveDocument(data: any) {
        this.requestsService.putRequest(ApiUrlConstants.UN_ARCHIVE_DOCUMENT_API_URL.replace("{dlDocumentId}", data.id), {})
            .subscribe({
                next: (response: any) => {
                    if (response.status === 200) {
                        this.toastService.success('Document un-archived successfully.', 'Document Library');
                        this.loadDocumentLibrary(this.appService.getSelectedFolderId(), true);
                    } else {
                        this.appService.handleError('', 'Document Library');
                    }
                },
                error: (error: any) => {
                    this.appService.handleError(error, 'Document Library');
                }
            });
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
                    } else {
                        this.dlDocuments = [];
                    }
                },
                error: (error: any) => {
                    this.appService.handleError(error, 'Document Library');
                }
            });
    }

    onRowSelect(event: any) {
        this.selectedDoc = event.data;
        this.appService.setDocInfoPaneState(true);
    }

    onRowUnselect(event: any) {
        this.selectedDoc = new DlDocumentDTO();
        this.appService.setDocInfoPaneState(false);
    }

    selectGrid(data: any) {
        this.selectedDoc = data;
        this.appService.setDocInfoPaneState(true);
    }

    openProfile(data: any) {
        let loggedInUserId = this.appService.getLoggedInUserId();
        if (data.updatedBy === Number.parseInt(String(loggedInUserId))) {
            this.router.navigate(['/profile']);
        }
    }

    ngOnDestroy(): void {
        localStorage.removeItem(window.btoa(AppConstants.SWM_SELECTED_FOLDER_ID));
        localStorage.removeItem(window.btoa(AppConstants.SWM_SELECTED_FOLDER_BREADCRUMB));
    }
}
