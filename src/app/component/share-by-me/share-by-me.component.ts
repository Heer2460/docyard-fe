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
import {forkJoin, Subject, takeUntil} from "rxjs";
import {UserDTO} from "../../model/settings/um/user/user.dto";

@Component({
    selector: 'share-by-me-component',
    templateUrl: './share-by-me.template.html',
    styleUrls: ['./share-by-me.component.less']
})
export class ShareByMeComponent implements OnInit, OnDestroy {

    @ViewChild('shareLinkInput') shareLinkInput: ElementRef | undefined;
    menuItems: MenuItem[] = [];
    shareDocumentDialog: boolean = false;
    dlDocuments: any[] = [];
    selectedDoc: DlDocumentDTO = new DlDocumentDTO();
    showDocInfoPane: boolean = false;
    showGridDisplay: boolean = false;
    dlFolderId: any;
    validExtensions: string[] = AppConstants.VALID_EXTENSIONS;
    breadcrumbs: BreadcrumbDTO[] = [];
    breadcrumbItemsToShow: any = 4;
    breadcrumbCollapsedItems: any[] = [];
    title: string = 'Shared By Me';
    shareWithUserForm: FormGroup = new FormGroup({});
    createSharedLink: boolean = false;
    departments: any[] = [];
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
                private toastService: ToastrService) {
        this.appService.showDocInfoPaneSubject.subscribe((value: boolean) => {
            this.showDocInfoPane = value;
        });
    }

    ngOnInit(): void {
        this.appService.setShowDocInfoPaneSubjectState(false);
        this.buildDocumentActions();
        this.buildForms();
        this.loadShareByMeData(this.appService.getSBMSelectedFolderId());
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
                label: 'Share',
                icon: 'icon-share',
                visible: !!this.selectedDoc.id,
                command: () => this.showShareDocumentDialog(this.selectedDoc)
            },
            {
                label: 'Download',
                icon: 'icon-download',
                command: () => {}
            }
        ];
    }

    buildForms() {
        this.shareWithUserForm = this.fb.group({
            message: [null],
            publicUrlLink: [null],
            shareType: ['ANYONE'],
            collaborators: [],
            sharePermission: ['VIEW'],
            departmentId: [null]
        });
    }

    loadShareByMeData(folderId: string) {
        let loggedInUserId = this.appService.getLoggedInUserId();
        this.requestsService.getRequest(ApiUrlConstants.GET_ALL_SBM_DL_DOCUMENT_BY_USER_API_URL
            .replace('{userId}', String(loggedInUserId))
            .replace("{folderId}", folderId))
            .subscribe({
                next: (response: HttpResponse<any>) => {
                    if (response.status === 200) {
                        this.dlDocuments = response.body.data;
                    } else {
                        this.dlDocuments = [];
                    }
                },
                error: (error: any) => {
                    this.appService.handleError(error, 'Shared By Me');
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
                }
            ];
        }
    }

    openFolder(rowData: any) {
        this.dlFolderId = rowData.id;
        if (this.dlFolderId != '') {
            this.loadShareByMeData(this.dlFolderId);
            this.updateBreadcrumb(rowData);
        }
    }

    openFile(rowData: any) {
        if (rowData.parentId == null) {
            rowData.parentId = '';
        }
        window.open(`/preview?id=${rowData.id}&folderId=${rowData.parentId}&shared=${window.btoa('sbm')}`, '_blank');
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
            this.loadShareByMeData(breadcrumb.id);
            this.breadcrumbs.pop();
        } else if (index == 1) {
            this.dlFolderId = '0';
            this.loadShareByMeData(this.dlFolderId);
        } else {
            this.router.navigate([breadcrumb.route]);
        }

        this.breadcrumbs = this.breadcrumbs.slice(0, index + 1);
        this.breadcrumbs[this.breadcrumbs.length - 1].active = true;
        this.setBreadcrumbAndSelectedItemToLocalStorage();
    }

    getBreadCrumbsFromLocalStorage(): BreadcrumbDTO[] {
        const breadcrumbs: any = localStorage.getItem(window.btoa(AppConstants.SBM_SELECTED_FOLDER_BREADCRUMB));
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
                    label: 'Shared By Me',
                    route: '/doc-lib',
                    active: true
                }
            ];
        }
    }

    setBreadcrumbAndSelectedItemToLocalStorage() {
        this.updateCollapsedBreadcrumbItems();
        localStorage.setItem(window.btoa(AppConstants.SBM_SELECTED_FOLDER_ID), this.dlFolderId);
        localStorage.setItem(window.btoa(AppConstants.SBM_SELECTED_FOLDER_BREADCRUMB), JSON.stringify(this.breadcrumbs));
    }


    downloadFile(data: any) {
        this.requestsService.getRequestFile(ApiUrlConstants.DOWNLOAD_DL_DOCUMENT_API_URL.replace("{dlDocumentId}", data.id))
            .subscribe({
                next: (response: any) => {
                    let mimeType = AppUtility.getMimeTypeByFileName(data.name);
                    let blob = new Blob([response], {type: mimeType});
                    FileSaver.saveAs(blob, data.name);
                    this.toastService.success('Document downloaded successfully.', 'Download Document');
                },
                error: (error: any) => {
                    this.appService.handleError(error, 'Shared By Me');
                }
            });
    }

    onRowSelect(event: any) {
        this.selectedDoc = event.data;
        this.appService.setShowDocInfoPaneSubjectState(true);
    }

    onRowUnselect(event: any) {
        this.selectedDoc = new DlDocumentDTO();
        this.appService.setShowDocInfoPaneSubjectState(false);
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
            shareType: selectedDoc.shareType,
            collaborators: [],
            sharePermission: 'VIEW',
            departmentId: null
        });
        this.createSharedLink = false;
        this.shareDocumentDialog = true;
        if (selectedDoc.shared && selectedDoc.shareType === 'ANYONE') {
            this.createSharedLink = true;
            this.onShareTypeChange();
        }
    }

    hideShareDocumentDialog() {
        this.shareDocumentDialog = false;
    }

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
                this.toastService.error('You can\'nt share without adding collaborator.', 'Share Document');
                return;
            }
        }
        this.requestsService.postRequest(ApiUrlConstants.DL_DOCUMENT_SHARE_API_URL, this.buildShareRequest(data))
            .subscribe({
                next: (response: HttpResponse<any>) => {
                    if (response.status === 200) {
                        this.toastService.success('Document has been shared successfully', 'Share Document');
                        this.loadShareByMeData(this.appService.getSBMSelectedFolderId());
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
                            this.toastService.success('Document has been removed successfully.', 'Sharing removed');
                            this.loadShareByMeData(this.appService.getSBMSelectedFolderId());
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
        localStorage.removeItem(window.btoa(AppConstants.SBM_SELECTED_FOLDER_ID));
        localStorage.removeItem(window.btoa(AppConstants.SBM_SELECTED_FOLDER_BREADCRUMB));
    }
}
