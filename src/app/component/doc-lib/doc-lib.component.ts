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
import * as FileSaver from 'file-saver';
import {BehaviorSubject, forkJoin, Subject, takeUntil} from "rxjs";
import {UserDTO} from "../../model/settings/um/user/user.dto";

@Component({
    selector: 'doc-lib-component',
    templateUrl: './doc-lib.template.html',
    styleUrls: ['./doc-lib.component.less']
})
export class DocLibComponent implements OnInit, OnDestroy {

    @ViewChild('fileUpload') fileUpload: ElementRef | undefined;
    @ViewChild('folderUpload') folderUpload: ElementRef | undefined;
    @ViewChild('shareLinkInput') shareLinkInput: ElementRef | undefined;

    filesToUpload: any[] = [];

    addFolderForm: FormGroup = new FormGroup({});
    renameDocumentForm: FormGroup = new FormGroup({});
    addFileForm: FormGroup = new FormGroup({});
    menuItems: MenuItem[] = [];
    uploadMenuItems: MenuItem[] = [];
    createMenuItems: MenuItem[] = [];
    visibleAddFolderDialog: boolean = false;
    renameDocumentDialog: boolean = false;
    shareDocumentDialog: boolean = false;
    dlDocuments: any[] = [];
    selectedDoc: DlDocumentDTO = new DlDocumentDTO();
    showDocInfoPane: boolean = false;
    showGridDisplay: boolean = false;
    dlFolderId: any;
    showFileUploader: boolean = true;
    files: any[] = [];
    averageProgress = 0;
    public cancelAllUploads = new BehaviorSubject<number>(-1);
    validExtensions: string[] = AppConstants.VALID_EXTENSIONS;
    breadcrumbs: BreadcrumbDTO[] = [];
    breadcrumbItemsToShow: any = 4;
    breadcrumbCollapsedItems: any[] = [];
    title: string = 'Document Library';
    shareWithUserForm: FormGroup = new FormGroup({});
    showMessageBox: boolean = false;
    createSharedLink: boolean = false;
    departments: any[] = [];
    users: UserDTO[] = [];
    previewTabs = {
        properties: true,
        comments: true,
        sharing: true,
    };
    destroy: Subject<boolean> = new Subject();
    shareTypes = [
        {label: 'Anyone with the link', value: 'ANYONE'},
        {label: 'Restricted', value: 'RESTRICTED'}
    ];
    shareSecurityTypes = [
        {label: 'VIEW', value: 'VIEW'},
        {label: 'COMMENT', value: 'COMMENT'}
    ];

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
        this.appService.setShowDocInfoPaneSubjectState(false);
        this.buildDocumentActions();
        this.buildOptionItems();
        this.buildForms();
        this.loadDocumentLibrary(this.appService.getSelectedFolderId(), false);
        this.breadcrumbs = this.getBreadCrumbsFromLocalStorage();
        this.updateCollapsedBreadcrumbItems();
        this.preloadedData();
        /* this.shareWithUserForm.controls['collaborators'].valueChanges.subscribe((value) => {
             this.showMessageBox = value.length > 0;
         })*/
    }

    preloadedData(): void {
        const users = this.requestsService.getRequest(ApiUrlConstants.USER_API_URL + 'search?status=Active');
        const departments = this.requestsService.getRequest(ApiUrlConstants.DEPARTMENT_API_URL + 'search?code=&name=&status=Active');
        forkJoin([users, departments])
            .pipe(takeUntil(this.destroy))
            .subscribe(
                {
                    next: (response: HttpResponse<any>[]) => {
                        if (response[0].status === 200) {
                            this.users = response[0].body.data;
                        }
                        if (response[1].status === 200) {
                            this.departments = response[1].body.data;
                        }
                    },
                    error: (error: any) => {
                        this.appService.handleError(error, 'Document Library');
                    }
                });
    }

    buildDocumentActions() {
        this.menuItems = [
            {
                label: 'Share',
                icon: 'icon-share',
                visible: !!this.selectedDoc.id,
                command: () => this.showShareDocumentDialog(this.selectedDoc)
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
            }
        ];
    }

    buildForms() {
        this.addFolderForm = this.fb.group({
            name: [null, [Validators.required, Validators.maxLength(255)]],
        });
        this.renameDocumentForm = this.fb.group({
            name: [null, [Validators.required, Validators.maxLength(255)]],
        });
        this.addFileForm = this.fb.group({
            name: [null, [Validators.required, Validators.maxLength(17)]],
        });

        this.shareWithUserForm = this.fb.group({
            message: [null],
            publicUrlLink: [null],
            shareType: ['ANYONE'],
            collaborators: [],
            sharePermission: ['VIEW'],
            departmentId: [null]
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
                    visible: !!this.selectedDoc.id,
                    command: () => this.showShareDocumentDialog(this.selectedDoc)
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
                    visible: !!this.selectedDoc.id,
                    command: () => this.showShareDocumentDialog(this.selectedDoc)
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

    openFile(rowData: any) {
        if (rowData.parentId == null) {
            rowData.parentId = '';

        }
        window.open(`/preview?id=${rowData.id}&folderId=${rowData.parentId}`, '_blank');
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

    showFileUploaderAction() {
        this.showFileUploader = !this.showFileUploader;
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

    onUploadFilesInitialize() {
        let uploadInput: HTMLElement = document.getElementById('files') as HTMLElement;
        uploadInput.click();
    }

    onUploadProcessStarted(event: any) {
        let files: any [] = event.target.files;
        if (files.length > 10) {
            this.toastService.error('Maximum 10 files allowed', 'Upload file');
            return;
        }
        if (files && files.length > 0) {
            for (let file of files) {
                let obj: any = {};
                obj['orgFile'] = file;
                obj['progress'] = 0;
                obj['uploaded'] = false;
                this.files.push(obj);
            }
            this.startUploadingFiles();
        }
    }

    startUploadingFiles() {
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

    makeUploadRequest(file: any, oncomplete: (response: any) => void, onprogress: (progress: any) => void,
                      onCancel: BehaviorSubject<number>, index: number) {
        let subscription = this.requestsService.postRequestMultipartFormAndDataUpload(ApiUrlConstants.UPLOAD_FILES_API_URL,
            file, {
                "createdBy": this.appService.userInfo.id,
                "updatedBy": this.appService.userInfo.id,
                "ownerId": this.appService.userInfo.id,
                "folderId": Number(localStorage.getItem(window.btoa(AppConstants.SELECTED_FOLDER_ID)))
            })
            .subscribe({
                next: (event: any) => {
                    if (event.type == HttpEventType.UploadProgress) {
                        let progress = Math.round(100 * event.loaded / event.total);
                        onprogress(progress);
                    } else if (event.type == HttpEventType.Response) {
                        oncomplete(event.body);
                        let folderId = Number(localStorage.getItem(window.btoa(AppConstants.SELECTED_FOLDER_ID)));
                        this.loadDocumentLibrary(String(folderId), false);
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

    createSharedLinkAction() {
        if (this.shareWithUserForm.get('shareType')?.value !== 'ANYONE') {
            this.createSharedLink = false;
            this.toastService.error('You can\'t generate link', 'Share Document');
            return;
        }
        this.createSharedLink = !this.createSharedLink;
    }

    openProfile(data: any) {
        let loggedInUserId = this.appService.getLoggedInUserId();
        if (data.updatedBy === Number.parseInt(String(loggedInUserId))) {
            this.router.navigate(['/profile']);
        }
    }

    // share code
    showShareDocumentDialog(selectedDoc: any) {
        this.shareWithUserForm.patchValue({
            message: null,
            publicUrlLink: null,
            shareType: 'ANYONE',
            collaborators: [],
            sharePermission: 'VIEW',
            departmentId: null
        });
        this.createSharedLink = false;
        this.shareDocumentDialog = true;
    }

    hideShareDocumentDialog() {
        this.shareDocumentDialog = false;
    }

    // share demo code

    onShareTypeChange() {
        if (this.shareWithUserForm.get('shareType')?.value === 'ANYONE') {
            this.shareWithUserForm.get(['collaborators'])?.disable();
            this.shareWithUserForm.get(['publicUrlLink'])?.enable();
            let url = this.generatePublicURL();
            this.shareWithUserForm.get(['publicUrlLink'])?.setValue(url);
            this.shareWithUserForm.get(['collaborators'])?.setValue([]);
        } else {
            this.shareWithUserForm.get(['collaborators'])?.enable();
            this.shareWithUserForm.get(['publicUrlLink'])?.disable();
            this.shareWithUserForm.get(['publicUrlLink'])?.setValue('');
        }
    }

    generatePublicURL(): string {
        let openURl = window.location.origin;
        if (this.selectedDoc.folder) {
            openURl += '/share/folder?id=' + window.btoa(this.selectedDoc?.id || '');
        } else {
            openURl += '/share/document-view?guid=';
            openURl += this.selectedDoc.versionGUId;
        }
        return openURl;
    }

    onShare(data: any) {
        if (data.shareType === 'RESTRICTED') {
            if (data.collaborators.length <= 0) {
                this.toastService.error('You can\'t share without adding collaborator.', 'Share Document');
                return;
            }
        }
        this.requestsService.postRequest(ApiUrlConstants.DL_DOCUMENT_SHARE_API_URL, this.buildShareRequest(data))
            .subscribe({
                next: (response: HttpResponse<any>) => {
                    if (response.status === 200) {
                        this.toastService.success('Document has been shared successfully', 'Share Document');
                        this.loadDocumentLibrary(this.appService.getSelectedFolderId(), false);
                        this.hideShareDocumentDialog();
                    }
                },
                error: (error: any) => {
                    this.appService.handleError(error, 'Share Document');
                }
            });
    }

    buildShareRequest(data: any) {
        let userId = Number(localStorage.getItem(window.btoa(AppConstants.AUTH_USER_ID)));
        return {
            dlDocId: this.selectedDoc.id,
            folder: this.selectedDoc.folder,
            shareType: data.shareType,
            shareLink: this.shareLinkInput?.nativeElement.value || '',
            message: data.message,
            departmentId: data.departmentId,
            dlCollaborators: data.collaborators ? data.collaborators : [],
            sharePermission: data.sharePermission,
            appContextPath: window.location.origin,
            externalUserShareLink: '',
            userId: String(userId),
        };
    }

    onAddCollaborator(value: any) {
        let regexp = new RegExp('[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}');
        let valid: boolean = regexp.test(value);
        if (!valid) {
            this.toastService.error('Email is not valid.', 'Share with Others');
            this.shareWithUserForm.controls['collaborators'].value.pop();
        } else {
            if (value != this.appService.userInfo.email) {
                let user = this.users.find(user => user.email === value);
                if (!user) {
                    this.shareWithUserForm.controls['collaborators'].value.pop();
                    this.toastService.error('Your are sharing outside the team, this is not allowed.', 'Share with Others');
                }
            } else {
                this.shareWithUserForm.controls['collaborators'].value.pop();
                this.toastService.error('You can\'nt share with yourself.', 'Share with Others');
            }
        }
    }

    copyLinkToClipboard(shareLink: any) {
        shareLink.select();
        document.execCommand('copy');
        shareLink.setSelectionRange(0, 0);
        this.toastService.success('Share Link has been copied.', 'Share Document');
    }

    ngOnDestroy(): void {
        localStorage.removeItem(window.btoa(AppConstants.SELECTED_FOLDER_ID));
        localStorage.removeItem(window.btoa(AppConstants.SELECTED_FOLDER_BREADCRUMB));
        this.destroy.next(true);
    }
}
