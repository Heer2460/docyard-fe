import {Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewChildren} from '@angular/core';
import {ConfirmationService, MenuItem} from "primeng/api";
import {AppService} from "../../service/app.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AppUtility} from "../../util/app.utility";
import {ApiUrlConstants} from "../../util/api.url.constants";
import {HttpErrorResponse, HttpEventType, HttpResponse} from "@angular/common/http";
import {RequestService} from "../../service/request.service";
import {DlDocumentDTO} from "../../model/settings/doc-handling/dl-document.dto";
import {AppConstants} from "../../util/app.constants";
import {BreadcrumbDTO} from "../../model/breadcrumb.dto";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import * as FileSaver from 'file-saver';
import {BehaviorSubject} from "rxjs";
import {UserDTO} from "../../model/settings/um/user/user.dto";
import {DocInfoPaneComponent} from "./doc-info-pane/doc-info-pane.component";

@Component({
    selector: 'doc-lib-component',
    templateUrl: './doc-lib.template.html',
    styleUrls: ['./doc-lib.component.less']
})
export class DocLibComponent implements OnInit, OnDestroy {

    @ViewChild('fileUpload') fileUpload: ElementRef | undefined;
    @ViewChild('folderUpload') folderUpload: ElementRef | undefined;
    @ViewChild('shareLinkInput') shareLinkInput: ElementRef | undefined;
    @ViewChildren('folderName') folderName: ElementRef | undefined;
    @ViewChild(DocInfoPaneComponent) docPane: any;

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
    createSharedLink: boolean = false;
    departments: any[] = [];
    users: UserDTO[] = [];
    loadDocument: boolean = false;
    previewTabs = {
        properties: true,
        comments: true,
        sharing: true,
    };
    shareTypes = [
        {label: 'Anyone with the link', value: 'ANYONE'},
        {label: 'Restricted', value: 'RESTRICTED'}
    ];
    shareSecurityTypes = [
        {label: 'VIEW', value: 'VIEW', detail: 'Download, View'},
        {label: 'COMMENT', value: 'COMMENT', detail: 'Download, View, Comment'}
    ];
    uploadPaths: any[] = [];

    constructor(public appService: AppService,
                private router: Router,
                private fb: FormBuilder,
                public appUtility: AppUtility,
                private requestsService: RequestService,
                private toastService: ToastrService,
                private confirmationService: ConfirmationService,
                private activatedRoute: ActivatedRoute) {
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

        this.activatedRoute.queryParams.subscribe((params: any) => {
            if (params.location) {
                const locationValue = window.atob(params.location);
                if (locationValue && (this.appService.getSelectedFolderId() != 0 || this.appService.getSelectedFolderId() != '0')) {
                    this.getDocumentHierarchy();
                }
            }
        })
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

    getDocumentHierarchy() {
        this.requestsService.getRequest(ApiUrlConstants.GET_DL_DOCUMENT_HIERARCHY_API_URL.replace("{dlDocumentId}", this.appService.getSelectedFolderId()))
            .subscribe({
                next: (response: any) => {
                    if (response.status === 200) {
                        this.breadcrumbs = [];
                        this.breadcrumbs = this.getDefaultBreadcrumb();
                        response.body.data.forEach((item: any) => {
                            this.breadcrumbs.push({
                                label: item.title,
                                id: item.id,
                                active: false
                            });
                        });
                        this.breadcrumbs[this.breadcrumbs.length - 1].active = true;
                        this.updateCollapsedBreadcrumbItems();
                    } else {
                        this.breadcrumbs = [];
                        this.breadcrumbs = this.getDefaultBreadcrumb();
                        this.breadcrumbs[this.breadcrumbs.length - 1].active = true;
                        this.updateCollapsedBreadcrumbItems();
                    }
                },
                error: (error: any) => {
                    this.appService.handleError(error, 'Document Library');
                }
            });
    }

    getDefaultBreadcrumb(): BreadcrumbDTO[] {
        return [
            {
                label: 'Home',
                route: '/home',
                active: false
            },
            {
                label: 'Document Library',
                route: '/doc-lib',
                active: false
            }
        ];
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
            },
            // {
            //     label: 'Folder',
            //     icon: 'icon-folder-plus',
            //     command: () => this.onUploadFolderInitialize()
            // }
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

    receiveCommentState($event: boolean) {
        this.loadDocument = $event;
        if (this.loadDocument) {
            this.loadDocumentLibrary(this.appService.getSelectedFolderId(), false);
        }
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
                            this.toastService.success('Folder created successfully', 'Document Library');
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
        window.open(`/preview?id=${rowData.id}&folderId=${rowData.parentId}&shared=${window.btoa('doclib')}`, '_blank');
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
            this.dlFolderId = breadcrumb.id;
            localStorage.setItem(window.btoa(AppConstants.SELECTED_FOLDER_ID), breadcrumb.id);
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

    // upload files code begins

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
                let fileSize = (file.size / 1024) / 1024;
                if (fileSize > 200) {
                    this.toastService.error("Size of file named '" + file.name + "' is more than 200 mb.");
                } else {
                    let obj: any = {};
                    obj['orgFile'] = file;
                    obj['progress'] = 0;
                    obj['uploaded'] = false;
                    this.files.push(obj);
                }
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
                }, error: (err: any) => {
                    const errorMsg = err.error ? JSON.parse(err.error).message : 'Upload files of size greater than 200MB.';
                    this.toastService.error(errorMsg, 'Upload file');
                    oncomplete(err);
                }
            });
        onCancel.subscribe(res => {
            if (res == index) {
                subscription.unsubscribe();
            }
        })
    }

    // upload files code end

    // upload folder code begins

    onUploadFolderInitialize() {
        let uploadInput: HTMLElement = document.getElementById('folder') as HTMLElement;
        uploadInput.click();
    }

    onUploadFolder(event: any) {
        console.log('Dir: ', event.target.files);

        for (let i = 0; i < event.target.files.length; i++) {
            const file = event.target.files[i];
            const path = file.webkitRelativePath.split('/');
            console.log(path);
        }
    }

    // net code

    /*filesPicked(event: any) {
        const folders = event.target.files;
        console.log(folders);
        this.uploadPaths = [];
        Array.prototype.forEach.call(folders, file => {
            this.uploadPaths.push(file.webkitRelativePath);
        });
        console.log(this.uploadPaths);
        for (let i = 0; i < folders.length; i++) {
            folders[i].isFile = true;
            folders[i].isDirectory = false;
        }
        setTimeout(() => {
            console.log(this.buildTree(folders, 'abcZ'));
        }, 2000);
    }

    private parseFileEntry(fileEntry: any) {
        console.log(fileEntry)
        return new Promise((resolve, reject) => {
            fileEntry.file(
                (file: any) => {
                    resolve(file);
                },
                (err: any) => {
                    reject(err);
                }
            );
        });
    }

    private parseDirectoryEntry(directoryEntry: any) {
        const directoryReader = directoryEntry.createReader();
        return new Promise((resolve, reject) => {
            directoryReader.readEntries(
                (entries: any) => {
                    resolve(this.buildTree(entries, directoryEntry.name));
                },
                (err: any) => {
                    reject(err);
                }
            );
        });
    }

    private buildTree(entry: any, name: any) {
        const entries:any [] = entry;
        console.log('entries:', entries)
        const tree = {name, files: [], directories: []};
        const promises: any[] = [];
        Array.from(entries).forEach((entry: any) => {
            if (entry.isFile) {
                const promise = this.parseFileEntry(entry).then(file => {
                    // @ts-ignore
                    tree.files.push(file);
                });
                promises.push(promise);
            } else if (entry.isDirectory) {
                const promise = this.parseDirectoryEntry(entry).then(directory => {
                    // @ts-ignore
                    tree.directories.push(directory);
                });
                promises.push(promise);
            }});
        return Promise.all(promises).then(() => tree);
    }*/

    // net code


    // upload folder code begins

    openProfile(data: any) {
        let loggedInUserId = this.appService.getLoggedInUserId();
        if (data.updatedBy === Number.parseInt(String(loggedInUserId))) {
            this.router.navigate(['/profile']);
        }
    }

    // share code

    createSharedLinkAction() {
        if (this.shareWithUserForm.get('shareType')?.value !== 'ANYONE') {
            this.createSharedLink = false;
            this.toastService.error('You can\'t generate link', 'Share Document');
            return;
        }
        this.createSharedLink = !this.createSharedLink;
    }

    showShareDocumentDialog(selectedDoc: any) {
        this.shareWithUserForm.patchValue({
            message: null,
            publicUrlLink: null,
            shareType: selectedDoc.shareType ? selectedDoc.shareType : 'ANYONE',
            collaborators: [],
            sharePermission: 'VIEW',
            departmentId: null
        });
        this.createSharedLink = false;
        this.shareDocumentDialog = true;
        this.onShareTypeChange();
        if (selectedDoc.shared && selectedDoc.shareType === 'ANYONE') {
            this.createSharedLink = true;
        }
        if (selectedDoc.dlShareId) {
            this.getShareDocDetails(selectedDoc.dlShareId);
        }
    }

    getShareDocDetails(id: any) {
        this.requestsService.getRequest(ApiUrlConstants.GET_DL_DOCUMENT_SHARE_DETAIL_API_URL.replace('{dlDocumentId}', id))
            .subscribe({
                next: (response: any) => {
                    if (response.status === 200) {
                        this.patchShareFormValue(response.body.data);
                    }
                },
                error: (error: any) => {
                    this.appService.handleError(error, 'Share Document');
                }
            });
    }

    patchShareFormValue(data: any) {
        let array: any[] = [];
        if (data.shareType === 'RESTRICTED' && data.dlShareCollaboratorDTOList.length > 0) {
            array = data.dlShareCollaboratorDTOList.map((item: any) => item.dlCollaboratorEmail);
        }
        this.shareWithUserForm.patchValue({
            message: data.shareNotes ? data.shareNotes : '',
            shareType: data.shareType ? data.shareType : 'ANYONE',
            collaborators: data.dlShareCollaboratorDTOList.length > 0 ? array : [],
            sharePermission: data.accessRight ? data.accessRight : 'VIEW',
            departmentId: data.departmentId ? data.departmentId : null
        });
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
            this.shareWithUserForm.get(['collaborators'])?.setValue([]);
            this.shareWithUserForm.get(['publicUrlLink'])?.disable();
            this.shareWithUserForm.get(['publicUrlLink'])?.setValue('');
        }
    }

    generatePublicURL(): string {
        let openURl = window.location.origin;
        if (this.selectedDoc.folder) {
            openURl += '/share/folder?id=' + window.btoa(this.selectedDoc?.id || '');
            openURl += '&name=' + window.btoa(this.selectedDoc.name || '');
        } else {
            openURl += '/share/document-view?guid=';
            openURl += this.selectedDoc.versionGUId;
            openURl += '&fromFolderShared=' + false;
        }
        return openURl;
    }

    onShare(data: any) {
        if (data.shareType === 'RESTRICTED') {
            if (data.collaborators.length <= 0) {
                this.toastService.error('You can\'t share without adding collaborator.', 'Share Document');
                return;
            }
        } else if (data.shareType === 'ANYONE' && !this.createSharedLink) {
            this.toastService.error('You can\'t share without creating a share link.', 'Share Document');
            return;
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
            // message: data.message,
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
                this.checkUserEmail(value);
            } else {
                this.shareWithUserForm.controls['collaborators'].value.pop();
                this.toastService.error('You can\'t share with yourself.', 'Share with Others');
            }
        }
    }

    checkUserEmail(email: string): any {
        this.requestsService.getRequest(ApiUrlConstants.USER_EMAIL_API_URL.replace('{email}', email))
            .subscribe({
                next: (response: HttpResponse<any>) => {
                    if (response.status === 200) {
                    } else {
                        this.shareWithUserForm.controls['collaborators'].value.pop();
                        this.shareWithUserForm.get(['collaborators'])?.setValue(this.shareWithUserForm.get('collaborators')?.value);
                        this.toastService.error('Your are sharing outside the team, this is not allowed.', 'Share with Others');
                    }
                },
                error: (error: any) => {
                    this.appService.handleError(error, 'Department');
                }
            });
    }

    copyLinkToClipboard(shareLink: any) {
        shareLink.select();
        document.execCommand('copy');
        shareLink.setSelectionRange(0, 0);
        this.toastService.success('Share Link has been copied.', 'Share Document');
    }

    onUnShareDocument(data: any) {
        this.requestsService.deleteRequest(ApiUrlConstants.DL_DOCUMENT_REMOVE_SHARE_API_URL, this.buildRemoveShareRequest(data))
            .subscribe({
                    next: (response: HttpResponse<any>) => {
                        if (response.status === 200) {
                            this.toastService.success('Sharing removed successfully.', 'Sharing removed');
                            this.loadDocumentLibrary(this.appService.getSelectedFolderId(), false);
                            this.hideShareDocumentDialog();
                        }
                    },
                    error: (error: any) => {
                        this.appService.handleError(error, 'Remove Share Document');
                    }
                }
            );
    }

    buildRemoveShareRequest(data: any) {
        let userId = Number(localStorage.getItem(window.btoa(AppConstants.AUTH_USER_ID)));
        return {
            dlDocId: data.id,
            folder: data.folder,
            shareType: 'NO_SHARING',
            shareLink: '',
            message: '',
            departmentId: '',
            dlCollaborators: [],
            sharePermission: '',
            appContextPath: '',
            externalUserShareLink: '',
            userId: String(userId),
        };
    }

    ngOnDestroy(): void {
        localStorage.removeItem(window.btoa(AppConstants.SELECTED_FOLDER_ID));
        localStorage.removeItem(window.btoa(AppConstants.SELECTED_FOLDER_BREADCRUMB));
    }
}
