import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ConfirmationService, MenuItem} from "primeng/api";
import {DlDocumentDTO} from "../../../model/settings/doc-handling/dl-document.dto";
import {AppConstants} from "../../../util/app.constants";
import {BreadcrumbDTO} from "../../../model/breadcrumb.dto";
import {AppService} from "../../../service/app.service";
import {Router} from "@angular/router";
import {AppUtility} from "../../../util/app.utility";
import {RequestService} from "../../../service/request.service";
import {ToastrService} from "ngx-toastr";
import {ApiUrlConstants} from "../../../util/api.url.constants";
import {HttpResponse} from "@angular/common/http";

@Component({
    selector: 'app-favourite',
    templateUrl: './favourite.component.html',
    styleUrls: ['./favourite.component.less']
})
export class FavouriteComponent implements OnInit {

    @ViewChild('fileUpload') fileUpload: ElementRef | undefined;
    @ViewChild('folderUpload') folderUpload: ElementRef | undefined;

    addFolderForm: FormGroup = new FormGroup({});
    renameDocumentForm: FormGroup = new FormGroup({});
    addFileForm: FormGroup = new FormGroup({});
    menuItems: MenuItem[] = [];
    visibleAddFolderDialog: boolean = false;
    renameDocumentDialog: boolean = false;
    dlDocuments: any[] = [];
    selectedDoc: DlDocumentDTO = new DlDocumentDTO();
    showDocInfoPane: boolean = true;
    showGridDisplay: boolean = false;
    dlFolderId: any;

    validExtensions: string[] = AppConstants.VALID_EXTENSIONS;

    breadcrumbs: BreadcrumbDTO[] = [];
    breadcrumbItemsToShow: any = 4;
    breadcrumbCollapsedItems: any[] = [];

    title: string = 'Favourite';

    constructor(public appService: AppService,
                private router: Router,
                private fb: FormBuilder,
                public appUtility: AppUtility,
                private requestsService: RequestService,
                private toastService: ToastrService,
                private confirmationService: ConfirmationService) {
        this.appService.showDocInfoPaneSubject.subscribe((value: boolean) => {
            this.showDocInfoPane = value;
        });
    }

    ngOnInit(): void {
        this.buildDocumentActions();
        this.buildForms();
        // this.loadDocumentLibrary('0', false);
        this.breadcrumbs = this.getBreadCrumbsFromLocalStorage();
        this.updateCollapsedBreadcrumbItems();
    }

    buildDocumentActions() {
        this.menuItems = [
            {
                label: 'Share',
                icon: 'icon-share',
                command: () => {
                }
            },
            {
                label: 'Download',
                icon: 'icon-download',
                command: () => {
                }
            },
            {
                label: 'Rename',
                icon: 'icon-edit',
                command: () => this.showRenameDocumentPopup(this.selectedDoc)
            },
        ];
    }

    buildForms() {
        this.addFolderForm = this.fb.group({
            name: [null, [Validators.required, Validators.maxLength(17)]],
        });
        this.renameDocumentForm = this.fb.group({
            name: [null, [Validators.required, Validators.maxLength(17)]],
        });
        this.addFileForm = this.fb.group({
            name: [null, [Validators.required, Validators.maxLength(17)]],
        });
    }

    // creating
    showAddFolderPopup() {
        this.addFolderForm.patchValue({
            name: '',
        });
        this.addFolderForm.markAsUntouched();
        this.visibleAddFolderDialog = true;
    }

    hideAddFolderPopup() {
        this.visibleAddFolderDialog = false;
    }

    // updating
    uploadFile(event: any) {
        // console.log('Single:', event.target.files[0]);
    }

    uploadFolder(event: any) {
        // console.log('Dir: ', event.target.files);

        // for (let i = 0; i < event.target.files.length; i++) {
        //     const file = event.target.files[i];
        //     const path = file.webkitRelativePath.split('/');
        //
        // }
    }

    loadDocumentLibrary(folderId: string, archived: boolean) {
        this.requestsService.getRequest(ApiUrlConstants.GET_ALL_DL_DOCUMENT_API_URL
            .replace("{folderId}", folderId).replace("{archived}", String(archived)))
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
            this.menuItems = [
                {
                    label: 'Share',
                    icon: 'icon-share',
                    command: () => {
                    }
                },
                {
                    label: 'Rename',
                    icon: 'icon-edit',
                    command: () => this.showRenameDocumentPopup(this.selectedDoc)
                },
                {
                    label: 'Delete',
                    icon: 'icon-trash',
                    command: () => this.onItemDeleteAction(this.selectedDoc)
                }
            ];
        } else {
            this.menuItems = [
                {
                    label: 'Share',
                    icon: 'icon-share',
                    command: () => {
                    }
                },
                {
                    label: 'Download',
                    icon: 'icon-download',
                    command: () => {
                    }
                },
                {
                    label: 'Rename',
                    icon: 'icon-edit',
                    command: () => this.showRenameDocumentPopup(this.selectedDoc)
                },
                {
                    label: 'Delete',
                    icon: 'icon-trash',
                    command: () => this.onItemDeleteAction(this.selectedDoc)
                },
            ];
        }
    }

    createFolder() {
        if (this.addFolderForm.invalid) {
            return;
        }
        let dlDocumentDTO: DlDocumentDTO = new DlDocumentDTO();
        dlDocumentDTO.convertToDTO(this.addFolderForm.value);
        dlDocumentDTO.parentId = this.appService.getSelectedFolderId() == '0' ? null : this.appService.getSelectedFolderId();

        if (dlDocumentDTO) {
            this.requestsService.postRequest(ApiUrlConstants.CREATE_FOLDER_API_URL, dlDocumentDTO)
                .subscribe({
                    next: (response: HttpResponse<any>) => {
                        if (response.status === 200) {
                            this.appService.successAddMessage('Document Library');
                            this.loadDocumentLibrary(this.appService.getSelectedFolderId(), false);
                            this.hideAddFolderPopup();
                        }
                    },
                    error: (error: any) => {
                        this.appService.handleError(error, 'Document Library');
                    }
                });
        }
    }

    openFolder(rowData: any) {
        this.dlFolderId = rowData.id;
        if (this.dlFolderId != '') {
            this.loadDocumentLibrary(this.dlFolderId, false);
            this.updateBreadcrumb(rowData);
        }
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
            this.loadDocumentLibrary(breadcrumb.id, false);
            this.breadcrumbs.pop();
        } else if (index == 1) {
            this.dlFolderId = '0';
            this.loadDocumentLibrary(this.dlFolderId, false);
        } else {
            this.router.navigate([breadcrumb.route]);
        }

        this.breadcrumbs = this.breadcrumbs.slice(0, index + 1);
        this.breadcrumbs[this.breadcrumbs.length - 1].active = true;
        this.setBreadcrumbAndSelectedItemToLocalStorage();
    }

    getBreadCrumbsFromLocalStorage(): BreadcrumbDTO[] {
        const breadcrumbs: any = localStorage.getItem(window.btoa(AppConstants.SELECTED_FOLDER_BREADCRUMB));

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
                    label: 'Document Library',
                    route: '/doc-lib',
                    active: true
                }
            ];
        }
    }

    setBreadcrumbAndSelectedItemToLocalStorage() {
        this.updateCollapsedBreadcrumbItems();
        localStorage.setItem(window.btoa(AppConstants.SELECTED_FOLDER_ID), this.dlFolderId);
        localStorage.setItem(window.btoa(AppConstants.SELECTED_FOLDER_BREADCRUMB), JSON.stringify(this.breadcrumbs));
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

    onItemDeleteAction(data: any) {
        this.confirmationService.confirm({
            message: `Are you sure you want to delete this ${data.folder == true ? 'folder' : 'file'}?`,
            accept: () => {
                this.onDeleteDocument(data.id)
            }
        });
    }

    onDeleteDocument(id: any) {
        let url = ApiUrlConstants.DL_DOCUMENT_ARCHIVED_API_URL.replace("{dlDocumentId}", String(id))
            .replace("{archived}", 'true');
        this.requestsService.putRequest(url, {})
            .subscribe({
                    next: (response: HttpResponse<any>) => {
                        if (response.status === 200) {
                            this.appService.successDeleteMessage('Document');
                            this.loadDocumentLibrary(this.appService.getSelectedFolderId(), false);
                        }
                    },
                    error: (error: any) => {
                        this.appService.handleError(error, 'Document');
                    }
                }
            );
    }

    showRenameDocumentPopup(data: any) {
        this.renameDocumentForm.patchValue({name: ''});
        this.renameDocumentForm.markAsUntouched();
        this.renameDocumentForm.patchValue({name: data.title});
        this.renameDocumentDialog = true;
    }

    hideRenameDocumentPopup() {
        this.renameDocumentDialog = false;
    }

    onRenameDocument() {
        let data = {
            id: this.selectedDoc.id,
            name: this.renameDocumentForm.value.name,
            updatedBy: localStorage.getItem(window.btoa(AppConstants.AUTH_USER_ID))
        };
        this.requestsService.putRequest(ApiUrlConstants.DL_DOCUMENT_RENAME_API_URL, data)
            .subscribe({
                    next: (response: HttpResponse<any>) => {
                        if (response.status === 200) {
                            this.appService.successUpdateMessage('Document');
                            this.hideRenameDocumentPopup();
                            this.loadDocumentLibrary(this.appService.getSelectedFolderId(), false);
                        }
                    },
                    error: (error: any) => {
                        this.appService.handleError(error, 'Document');
                    }
                }
            );

    }

    downloadFile() {
        // let url = ApiUrlConstants.REPORT_API_URL + 'pm/{pmId}';
        this.requestsService.getRequestFile('')
            .subscribe({
                next: (response: any) => {
                    // let blob = new Blob([response], {type: 'application/pdf'});
                    // FileSaver.saveAs(blob, 'File.pdf');
                    this.toastService.success('Downloaded successfully.', 'File');
                },
                error: (error: any) => {
                    this.appService.handleError(error, 'File');
                }
            });
    }

    ngOnDestroy(): void {
        localStorage.removeItem(window.btoa(AppConstants.SELECTED_FOLDER_ID));
        localStorage.removeItem(window.btoa(AppConstants.SELECTED_FOLDER_BREADCRUMB));
    }

}
