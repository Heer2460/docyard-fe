import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AppService} from "../../../service/app.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiUrlConstants} from "../../../util/api.url.constants";
import {HttpResponse} from "@angular/common/http";
import {RequestService} from "../../../service/request.service";
import {AppConstants} from "../../../util/app.constants";
import {ToastrService} from "ngx-toastr";
import {AppUtility} from "../../../util/app.utility";
import * as FileSaver from "file-saver";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Location} from "@angular/common";
import {RoleActionConstants} from "../../../util/role.actions.constants";

@Component({
    selector: 'preview-component',
    templateUrl: './preview.template.html',
    styleUrls: ['./preview.component.less'],
})
export class PreviewComponent implements OnInit {

    @ViewChild('shareLinkInput') shareLinkInput: ElementRef | undefined;

    showDocInfoPane: boolean = true;
    defaultZoom: number = 0;
    magnifierZoom: number = this.defaultZoom;
    imageObj: any = null;
    initialWidth: number = 0;
    initialHeight: number = 0;
    stared: boolean = false;
    queryParams: any;
    dlDocuments: any[] = [];
    currentDocIndex: number = 0;
    selectedDoc: any;
    validExtensions: string[] = AppConstants.VALID_EXTENSIONS;
    shareDocumentDialog: boolean = false;
    createSharedLink: boolean = false;
    shareWithUserForm: FormGroup = new FormGroup({});
    departments: any[] = [];
    previewTabs = {
        properties: true,
        comments: true,
        sharing: true,
    };
    routePreviewConstants = {
        SBM: 'sbm',
        SWM: 'swm',
        SEARCH: 'search',
        DOCLIB: 'doclib',
    };
    shareTypes = [
        {label: 'Anyone with the link', value: 'ANYONE'},
        {label: 'Restricted', value: 'RESTRICTED'}
    ];
    shareSecurityTypes = [
        {label: 'VIEW', value: 'VIEW', detail: 'Download, View'},
        {label: 'COMMENT', value: 'COMMENT', detail: 'Download, View, Comment'}
    ];
    sharedPreview: string = '';

    constructor(public appService: AppService,
                private activatedRoute: ActivatedRoute,
                private requestsService: RequestService,
                private router: Router,
                private fb: FormBuilder,
                private toastService: ToastrService,
                private location: Location) {
        this.appService.setDocInfoPaneState(this.showDocInfoPane);
    }

    ngOnInit(): void {
        this.showDocInfoPane = this.appService.getDocInfoPaneState();
        this.setInitialProps();
        this.activatedRoute.queryParams.subscribe((params: any) => {
            this.queryParams = params;
            const folderId = this.queryParams.folderId ? this.queryParams.folderId : '0'
            this.loadDocumentLibrary(folderId, false);
            if (this.queryParams.shared) {
                this.sharedPreview = window.atob(this.queryParams.shared);
            }
        })

        this.buildForms();
        this.preloadedData();
    }

    buildForms() {
        this.shareWithUserForm = this.fb.group({
            message: [null],
            publicUrlLink: [null],
            shareType: ['ANYONE'],
            collaborators: [null],
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

    loadDocumentLibrary(folderId: string, archived: boolean) {
        this.requestsService.getRequest(ApiUrlConstants.GET_ALL_SHARED_PREVIEW_DL_DOCUMENT_API_URL
            .replace("{folderId}", folderId)
            .replace("{archived}", String(archived)))
            .subscribe({
                next: (response: HttpResponse<any>) => {
                    if (response.status === 200) {
                        this.dlDocuments = response.body.data;
                        this.dlDocuments = this.dlDocuments.filter(doc => !doc.folder);
                        this.findCurrentFileFromDocs();
                    } else {
                        this.dlDocuments = [];
                    }
                },
                error: (error: any) => {
                    this.appService.handleError(error, 'Preview Document');
                }
            });
    }

    favouriteDocument(row: any) {
        const isChecked = !row.favourite;
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
                            const folderId = this.queryParams.folderId ? this.queryParams.folderId : '0'
                            this.loadDocumentLibrary(folderId, false);
                        }
                    },
                    error: (error: any) => {
                        this.appService.handleError(error, 'Document Library');
                    }
                }
            );
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

    magnifierZoomInAction() {
        this.magnifierZoom += 10;
        this.generateStyleObj();
    }

    magnifierZoomOutAction() {
        this.magnifierZoom -= 10;
        this.generateStyleObj();
    }

    setInitialProps() {
        this.imageObj = document.querySelector('.image-container img');
        this.initialWidth = this.imageObj?.clientWidth;
        this.initialHeight = this.imageObj?.clientHeight;
    }

    generateStyleObj() {

        const calcWidth = ((this.initialWidth * this.magnifierZoom) / 100) + this.initialWidth;
        const calcHeight = ((this.initialHeight * this.magnifierZoom) / 100) + this.initialHeight;

        this.imageObj.style.width = `${calcWidth}px`;
        this.imageObj.style.height = `${calcHeight}px`;

    }

    starFileAction() {
        this.stared = !this.stared;
    }

    findCurrentFileFromDocs() {
        this.selectedDoc = this.dlDocuments.find((doc, index) => {
            if (this.queryParams.id == doc.id && doc.folder == false) {
                this.currentDocIndex = index
                return doc;
            }
        });
        this.selectedDoc.name = this.appService.getFileNameExtracted(this.selectedDoc.name);
    }

    openPrevFileAction() {
        if (this.currentDocIndex > 0) {
            this.currentDocIndex--;
        }
        this.selectedDoc = this.dlDocuments[this.currentDocIndex];
    }

    openNextFileAction() {
        if (this.currentDocIndex < this.dlDocuments.length - 1) {
            this.currentDocIndex++;
        }
        this.selectedDoc = this.dlDocuments[this.currentDocIndex];
    }

    checkValidImageFile() {
        return this.selectedDoc?.mimeType?.split('/')[0] == 'image'
    }

    getValidExtension() {
        return this.validExtensions?.indexOf(this.selectedDoc?.extension) > -1
    }

    backToDocLibAction() {
        switch (this.sharedPreview) {
            case 'doclib':
                this.router.navigate(['/doc-lib']);
                break;
            case 'search':
                this.router.navigate(['/search']);
                break;
            case 'sbm':
                this.router.navigate(['/shared-by-me']);
                break;
            case 'swm':
                this.router.navigate(['/shared-with-me']);
                break;
            case 'recent':
                this.router.navigate(['/home']);
                break;
            default:
                this.router.navigate(['/home']);
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

}
