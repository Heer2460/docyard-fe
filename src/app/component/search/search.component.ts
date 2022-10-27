import {Component, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";
import {DlDocumentDTO} from "../../model/settings/doc-handling/dl-document.dto";
import {AppConstants} from "../../util/app.constants";
import {BreadcrumbDTO} from "../../model/breadcrumb.dto";
import {HttpResponse} from "@angular/common/http";
import {AppService} from "../../service/app.service";
import {RequestService} from "../../service/request.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiUrlConstants} from "../../util/api.url.constants";
import {AppUtility} from "../../util/app.utility";
import * as FileSaver from "file-saver";
import {ToastrService} from "ngx-toastr";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.less']
})
export class SearchComponent implements OnInit {

    menuItems: MenuItem[] = [];
    dlDocuments: any[] = [];
    selectedDoc: DlDocumentDTO = new DlDocumentDTO();
    showGridDisplay: boolean = false;
    validExtensions: string[] = AppConstants.VALID_EXTENSIONS;
    renameDocumentForm: FormGroup = new FormGroup({});
    breadcrumbs: BreadcrumbDTO[] = [
        {
            label: 'Home',
            route: '/home',
            active: false
        },
        {
            label: 'Document Library',
            route: '/doc-lib',
            active: false
        },
        {
            label: 'Search',
            route: '/search',
            active: true
        }
    ];
    title: string = 'Search';
    searchValue: string = '';

    constructor(private appService: AppService,
                private requestsService: RequestService,
                private activatedRoute: ActivatedRoute,
                public appUtility: AppUtility,
                private toastService: ToastrService,
                private fb: FormBuilder,
                private router: Router) {
    }

    ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe((params) => {
            this.searchValue = params['value'];
            if (this.searchValue) {
                this.searchAllDocuments(this.searchValue);
            }
        });
        this.buildForms();
    }

    buildForms() {
        this.renameDocumentForm = this.fb.group({
            name: [null, [Validators.required, Validators.maxLength(255)]],
        });
    }


    searchAllDocuments(searchKey: string) {
        let loggedInUserId = this.appService.getLoggedInUserId();
        this.requestsService.getRequest(ApiUrlConstants.DL_DOCUMENT_SEARCH_API_URL
            .replace('{userid}', String(loggedInUserId))
            .replace('{searchKey}', searchKey))
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

    onMenuClicked(data: DlDocumentDTO) {
        this.selectedDoc = data;
        if (this.selectedDoc.folder == true) {
            this.menuItems = [];
        } else {
            this.menuItems = [
                {
                    label: 'Download',
                    icon: 'icon-download',
                    command: () => this.downloadFile(this.selectedDoc)
                },
                {
                    label: 'Go to folder location',
                    icon: 'icon-folder',
                    command: () => this.folderLocation(this.selectedDoc)
                }
            ];
        }
    }

    folderLocation(data: any) {
        if (data.parentId == null) {
            data.parentId = '0';
        }
        localStorage.setItem(window.btoa(AppConstants.SELECTED_FOLDER_ID), data.parentId);
        this.router.navigate(['/doc-lib'], {queryParams: {location: window.btoa('true')}});
    }

    openFile(rowData: any) {
        if (rowData.parentId == null) {
            rowData.parentId = '';
        }
        window.open(`/preview?id=${rowData.id}&folderId=${rowData.parentId}&shared=${window.btoa('search')}`, '_blank');
    }

    openProfile(data: any) {
        let loggedInUserId = this.appService.getLoggedInUserId();
        if (data.updatedBy === Number.parseInt(String(loggedInUserId))) {
            this.router.navigate(['/profile']);
        }
    }

    setGridDisplay() {
        this.showGridDisplay = true;
    }

    setListDisplay() {
        this.showGridDisplay = false;
    }

    navigateToRoute(breadcrumb: BreadcrumbDTO) {
        this.router.navigate([breadcrumb.route]);
    }

    navigateToDocLib(id: any) {
        localStorage.setItem(window.btoa(AppConstants.SELECTED_FOLDER_ID), id);
        this.router.navigate(['/doc-lib']);
    }

    downloadFile(data: any) {
        this.requestsService.getRequestFile(ApiUrlConstants.DOWNLOAD_DL_DOCUMENT_API_URL.replace("{dlDocumentId}", data.id))
            .subscribe({
                next: (response: any) => {
                    let mimeType = AppUtility.getMimeTypeByFileName(data.name);
                    let blob = new Blob([response], {type: mimeType});
                    FileSaver.saveAs(blob, data.name);
                    this.toastService.success('Document downloaded successfully.', 'Document Library');
                },
                error: (error: any) => {
                    this.appService.handleError(error, 'Document Library');
                }
            });
    }

    favouriteDocument(event: any, row: any) {
        const isChecked = event.target.checked;
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
}
