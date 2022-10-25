import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ConfirmationService, MenuItem} from "primeng/api";
import {ApiUrlConstants} from "../../util/api.url.constants";
import {HttpResponse} from "@angular/common/http";
import {RequestService} from "../../service/request.service";
import {AppService} from "../../service/app.service";
import {AppConstants} from "../../util/app.constants";
import {AppUtility} from "../../util/app.utility";
import * as FileSaver from "file-saver";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DlDocumentDTO} from "../../model/settings/doc-handling/dl-document.dto";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";

@Component({
    selector: 'home-component',
    templateUrl: './home.template.html',
    styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

    @ViewChild('shareLinkInput') shareLinkInput: ElementRef | undefined;
    renameDocumentForm: FormGroup = new FormGroup({});
    shareWithUserForm: FormGroup = new FormGroup({});
    userInfo: any;
    renameDocumentDialog: boolean = false;
    menuItems: MenuItem[] = [
        {
            label: 'Share',
            icon: 'icon-share',
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
        }
    ];
    recentDocs: any[] = [];
    selectedDoc: DlDocumentDTO = new DlDocumentDTO();
    shareDocumentDialog: boolean = false;
    createSharedLink: boolean = false;
    departments: any[] = [];
    validExtensions: string[] = AppConstants.VALID_EXTENSIONS;
    dashboardStats: any;
    shareTypes = [
        {label: 'Anyone with the link', value: 'ANYONE'},
        {label: 'Restricted', value: 'RESTRICTED'}
    ];
    shareSecurityTypes = [
        {label: 'VIEW', value: 'VIEW', detail: 'Download, View'},
        {label: 'COMMENT', value: 'COMMENT', detail: 'Download, View, Comment'}
    ];

    constructor(private requestsService: RequestService,
                private appService: AppService,
                private fb: FormBuilder,
                public appUtility: AppUtility,
                private toastService: ToastrService,
                private router: Router,
                private confirmationService: ConfirmationService) {
        let userData: any = localStorage.getItem(window.btoa(AppConstants.AUTH_USER_INFO));
        this.userInfo = JSON.parse(userData);
    }

    ngOnInit(): void {
        this.getRecentDocument();
        this.buildForms();
        this.getDashboardStats();
        this.preloadedData();
    }

    buildForms() {
        this.renameDocumentForm = this.fb.group({
            name: [null, [Validators.required, Validators.maxLength(255)]],
        });

        this.shareWithUserForm = this.fb.group({
            message: [null],
            publicUrlLink: [null],
            shareType: [''],
            collaborators: [],
            sharePermission: ['VIEW'],
            departmentId: [null]
        });
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

    onMenuClicked(data: DlDocumentDTO) {
        this.selectedDoc = data;
    }

    getDashboardStats() {
        let loggedInUser = this.appService.getLoggedInUserId();
        this.requestsService.getRequest(ApiUrlConstants.DASHBOARD_STATS_API_URL.replace('{userId}', String(loggedInUser)))
            .subscribe({
                next: (response: HttpResponse<any>) => {
                    if (response.status === 200) {
                        this.dashboardStats = response.body.data;
                    } else {
                        this.dashboardStats = {};
                    }
                },
                error: (error: any) => {
                    this.appService.handleError(error, 'Dashboard');
                }
            });
    }

    getRecentDocument() {
        let loggedInUser = this.appService.getLoggedInUserId();
        let url = ApiUrlConstants.GET_RECENT_DOCUMENT_API_URL + loggedInUser;
        this.requestsService.getRequest(url)
            .subscribe({
                next: (response: HttpResponse<any>) => {
                    if (response.status === 200) {
                        this.recentDocs = response.body.data;
                    } else {
                        this.recentDocs = [];
                    }
                },
                error: (error: any) => {
                    this.appService.handleError(error, 'Recent Documents');
                }
            });
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
                            this.appService.successDeleteMessage('Recent Documents');
                            this.getRecentDocument();
                        }
                    },
                    error: (error: any) => {
                        this.appService.handleError(error, 'Recent Documents');
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
                            this.appService.successUpdateMessage('Rename Document');
                            this.hideRenameDocumentPopup();
                            this.getRecentDocument();
                        }
                    },
                    error: (error: any) => {
                        this.appService.handleError(error, 'Rename Document');
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
                    this.toastService.success('Document downloaded successfully.', 'Recent Documents');
                },
                error: (error: any) => {
                    this.appService.handleError(error, 'Recent Documents');
                }
            });
    }

    openProfile(data: any) {
        let loggedInUserId = this.appService.getLoggedInUserId();
        if (data.updatedBy === Number.parseInt(String(loggedInUserId))) {
            this.router.navigate(['/profile']);
        }
    }

    openFile(rowData: any) {
        if (rowData.parentId == null) {
            rowData.parentId = '';
        }
        window.open(`/preview?id=${rowData.id}&folderId=${rowData.parentId}&shared=${window.btoa('recent')}`, '_blank');
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
        if (data.dlShareCollaboratorDTOList.length > 0) {
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
        }
        this.requestsService.postRequest(ApiUrlConstants.DL_DOCUMENT_SHARE_API_URL, this.buildShareRequest(data))
            .subscribe({
                next: (response: HttpResponse<any>) => {
                    if (response.status === 200) {
                        this.toastService.success('Document has been shared successfully', 'Share Document');
                        this.getRecentDocument();
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
                            this.getRecentDocument();
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

    // share code ends
}
