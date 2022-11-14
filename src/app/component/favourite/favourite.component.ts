import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {MenuItem} from "primeng/api";
import {DlDocumentDTO} from "../../model/settings/doc-handling/dl-document.dto";
import {AppConstants} from "../../util/app.constants";
import {BreadcrumbDTO} from "../../model/breadcrumb.dto";
import {AppService} from "../../service/app.service";
import {Router} from "@angular/router";
import {AppUtility} from "../../util/app.utility";
import {RequestService} from "../../service/request.service";
import {ToastrService} from "ngx-toastr";
import {ApiUrlConstants} from "../../util/api.url.constants";
import {HttpResponse} from "@angular/common/http";
import * as FileSaver from "file-saver";

@Component({
    selector: 'favourite-component',
    templateUrl: './favourite.component.html',
    styleUrls: ['./favourite.component.less']
})
export class FavouriteComponent implements OnInit {

    @ViewChild('shareLinkInput') shareLinkInput: ElementRef | undefined;
    shareWithUserForm: FormGroup = new FormGroup({});
    menuItems: MenuItem[] = [];
    dlDocuments: any[] = [];
    selectedDoc: DlDocumentDTO = new DlDocumentDTO();
    showGridDisplay: boolean = false;
    dlFolderId: any;
    validExtensions: string[] = AppConstants.VALID_EXTENSIONS;
    breadcrumbs: BreadcrumbDTO[] = [];
    breadcrumbItemsToShow: any = 4;
    breadcrumbCollapsedItems: any[] = [];
    departments: any[] = [];
    shareDocumentDialog: boolean = false;
    createSharedLink: boolean = false;
    title: string = 'Starred';
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
        this.loadAllFavouriteDlDocuments('0', false);
        this.breadcrumbs = this.getBreadCrumbsFromLocalStorage();
        this.updateCollapsedBreadcrumbItems();
        this.buildForm();
        this.preloadedData();
    }

    buildForm() {
        this.shareWithUserForm = this.fb.group({
            message: [null],
            publicUrlLink: [null],
            shareType: ['ANYONE'],
            collaborators: [],
            sharePermission: ['VIEW'],
            departmentId: [null]
        });
    }

    buildDocumentActions() {
        this.menuItems = [
            {
                label: 'Share',
                icon: 'icon-share',
                command: () => {}
            },
            {
                label: 'Download',
                icon: 'icon-download',
                command: () => {}
            }
        ];
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

    loadAllFavouriteDlDocuments(folderId: string, archived: boolean) {
        let loggedInUserId = this.appService.getLoggedInUserId();
        this.requestsService.getRequest(ApiUrlConstants.GET_ALL_FAVOURITE_DL_DOCUMENT_BY_OWNER_API_URL
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
                    this.appService.handleError(error, 'Starred');
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
                    command: () => this.showShareDocumentDialog(this.selectedDoc)
                },
            ];
        } else {
            this.menuItems = [
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
            ];
        }
    }

    openFolder(rowData: any) {
        this.dlFolderId = rowData.id;
        if (this.dlFolderId != '') {
            this.loadAllFavouriteDlDocuments(this.dlFolderId, false);
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
            this.loadAllFavouriteDlDocuments(breadcrumb.id, false);
            this.breadcrumbs.pop();
        } else if (index == 1) {
            this.dlFolderId = '0';
            this.loadAllFavouriteDlDocuments(this.dlFolderId, false);
        } else {
            this.router.navigate([breadcrumb.route]);
        }

        this.breadcrumbs = this.breadcrumbs.slice(0, index + 1);
        this.breadcrumbs[this.breadcrumbs.length - 1].active = true;
        this.setBreadcrumbAndSelectedItemToLocalStorage();
    }

    getBreadCrumbsFromLocalStorage(): BreadcrumbDTO[] {
        const breadcrumbs: any = localStorage.getItem(window.btoa(AppConstants.FAV_SELECTED_FOLDER_BREADCRUMB));

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
                    label: 'Starred',
                    route: '/favourite',
                    active: true
                }
            ];
        }
    }

    setBreadcrumbAndSelectedItemToLocalStorage() {
        this.updateCollapsedBreadcrumbItems();
        localStorage.setItem(window.btoa(AppConstants.FAV_SELECTED_FOLDER_ID), this.dlFolderId);
        localStorage.setItem(window.btoa(AppConstants.FAV_SELECTED_FOLDER_BREADCRUMB), JSON.stringify(this.breadcrumbs));
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
                            this.dlFolderId = this.dlFolderId ? this.dlFolderId : '0';
                            this.loadAllFavouriteDlDocuments(this.dlFolderId, false);
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
                        this.dlFolderId = this.dlFolderId ? this.dlFolderId : '0';
                        this.loadAllFavouriteDlDocuments(this.dlFolderId, false);
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
                            this.dlFolderId = this.dlFolderId ? this.dlFolderId : '0';
                            this.loadAllFavouriteDlDocuments(this.dlFolderId, false);
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

    // share code end

    ngOnDestroy(): void {
        localStorage.removeItem(window.btoa(AppConstants.FAV_SELECTED_FOLDER_ID));
        localStorage.removeItem(window.btoa(AppConstants.FAV_SELECTED_FOLDER_BREADCRUMB));
    }

}
