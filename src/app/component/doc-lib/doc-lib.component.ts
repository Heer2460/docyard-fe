import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ConfirmationService, MenuItem} from "primeng/api";
import {AppService} from "../../service/app.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AppUtility} from "../../util/app.utility";
import {ApiUrlConstants} from "../../util/api.url.constants";
import {HttpEventType, HttpResponse} from "@angular/common/http";
import {RequestService} from "../../service/request.service";
import {DlDocumentDTO} from "../../model/settings/doc-handling/dl-document.dto";
import {AppConstants} from "../../util/app.constants";
import {BreadcrumbDTO} from "../../model/breadcrumb.dto";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
// @ts-ignore
import * as FileSaver from 'file-saver';
import {BehaviorSubject} from "rxjs";

@Component({
    selector: 'doc-lib-component',
    templateUrl: './doc-lib.template.html',
    styleUrls: ['./doc-lib.component.less']
})
export class DocLibComponent implements OnInit, OnDestroy {

    @ViewChild('fileUpload') fileUpload: ElementRef | undefined;
    @ViewChild('folderUpload') folderUpload: ElementRef | undefined;

    filesToUpload: any[] = [];

    addFolderForm: FormGroup = new FormGroup({});
    renameDocumentForm: FormGroup = new FormGroup({});
    addFileForm: FormGroup = new FormGroup({});
    menuItems: MenuItem[] = [];
    uploadMenuItems: MenuItem[] = [];
    createMenuItems: MenuItem[] = [];
    visibleAddFolderDialog: boolean = false;
    renameDocumentDialog: boolean = false;
    dlDocuments: any[] = [];
    selectedDoc: DlDocumentDTO = new DlDocumentDTO();
    showDocInfoPane: boolean = false;
    showGridDisplay: boolean = false;
    dlFolderId: any;
    showFileUploader: boolean = true;
    files: any[] = [];
    averageProgress = 0;
    public cancelAllUploads = new BehaviorSubject<number>(0);



    validExtensions: string[] = AppConstants.VALID_EXTENSIONS;

    breadcrumbs: BreadcrumbDTO[] = [];
    breadcrumbItemsToShow: any = 4;
    breadcrumbCollapsedItems: any[] = [];

    title: string = 'Document Library';

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
        this.buildOptionItems();
        this.buildForms();
        this.loadDocumentLibrary(this.appService.getSelectedFolderId(), false);
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

    buildOptionItems() {
        this.createMenuItems = [
            {
                label: 'Folder',
                icon: 'icon-folder-plus',
                command: () => this.showAddFolderPopup()
            },
        ];
        this.uploadMenuItems = [
            {
                label: 'File',
                icon: 'icon-file-plus',
                command: () => this.onUploadFilesInitialize()
            },
            {
                label: 'Folder',
                icon: 'icon-folder-plus',
                command: () => this.folderUpload?.nativeElement.click()
            }
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

    // updloading

    uploadFolder(event: any) {
        // console.log('Dir: ', event.target.files);

        // for (let i = 0; i < event.target.files.length; i++) {
        //     const file = event.target.files[i];
        //     const path = file.webkitRelativePath.split('/');
        //
        // }
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
                    command: () => this.downloadFile(this.selectedDoc)
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

    ngOnDestroy(): void {
        localStorage.removeItem(window.btoa(AppConstants.SELECTED_FOLDER_ID));
        localStorage.removeItem(window.btoa(AppConstants.SELECTED_FOLDER_BREADCRUMB));
    }

    showFileUploaderAction() {
        this.showFileUploader = !this.showFileUploader;
    }

    removeFileFromList(index: number) {
        if (index !== -1) {
            this.filesToUpload.splice(index, 1);
        }
    }

    removeAllFilesFromList() {
        this.filesToUpload = [];
    }
    
    onRowSelect(event: any) {
        this.selectedDoc = event.data;
        this.appService.setShowDocInfoPaneSubjectState(true);
    }
    
    onRowUnselect(event: any) {
        this.selectedDoc = new DlDocumentDTO();
        this.appService.setShowDocInfoPaneSubjectState(false);
    }

    // uploading files code start

    uploadFile(event: any) {
        this.filesToUpload = [...event.target.files];
    }

    onUploadFilesInitialize() {
        let uploadInput: HTMLElement = document.getElementById('files') as HTMLElement;
        uploadInput.click();
    }

    onUploadProcessStarted(event: any) {
        let files = event.target.files;
        if (files && files.length > 0) {
            for (let file of files) {
                let obj: any = {};
                obj['orgFile'] = file;
                obj['progress'] = 0;
                obj['uploaded'] = false;
                this.files.push(obj);
            }
            // this.uploadPopupVisible = true;
            this.startUploadingFiles();
        }
    }

    startUploadingFiles() {
        console.log('2nd func', this.files);
        this.files.forEach((file, i) => {
            if (file.uploaded === false) {
                this.makeUploadRequest(file,
                    (res) => {
                        file['uploaded'] = true;
                    },
                    (value) => {
                        file.progress = value;
                        this.getAverageProgress();
                    }, this.cancelAllUploads, i)
            }
        });
    }

    onCancelClick(index: number) {
        this.cancelAllUploads.next(index);
        this.files.splice(index, 1);
    }

    getAverageProgress() {
        let totalProgress = 0;
        this.files.forEach((file) => {
            totalProgress += file.progress;
        });
        this.averageProgress = Math.round(totalProgress / this.files.length);
    }

    makeUploadRequest(file: any[], oncomplete: (response: any) => void,
                      onprogress: (progress: any) => void,
                      onCancel: BehaviorSubject<number>, index: number) {
        // console.log('file', file);
        // return;
        let subscription = this.requestsService.postRequestMultipartFormAndDataUpload(ApiUrlConstants.UPLOAD_FILES_API_URL,
            file, {
                "creatorId": this.appService.userInfo.id,
                "ownerId": this.appService.userInfo.id,
                "folderId": Number.parseInt(window.atob(localStorage.getItem(window.btoa('folderId')) + ''))
            })
            .subscribe({
                next: (event: any) => {
                    if (event.type == HttpEventType.UploadProgress) {
                        let progress = Math.round(100 * event.loaded / event.total);
                        onprogress(progress);
                    } else if (event.type == HttpEventType.Response) {
                        oncomplete(event.body);
                        let folderId = Number.parseInt(window.atob(localStorage.getItem(window.btoa('folderId')) +''));
                        // this.loadAllDocsFolders(folderId);
                    }
                }, error: err => {
                    oncomplete(err);
                }
            });
        onCancel.subscribe(res => {
            if (res == index) {
                subscription.unsubscribe();
            }
        })
    }

    closeUploadPopup() {
        // this.uploadPopupVisible = false;
    }

    expandPopup(status: boolean) {
        // this.isUploadPopupExpanded = status;
    }
}
