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
import {UserDTO} from "../../../model/settings/um/user/user.dto";
import {forkJoin, Subject, takeUntil} from "rxjs";

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
    users: UserDTO[] = [];
    destroy: Subject<boolean> = new Subject();
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
                private activatedRoute: ActivatedRoute,
                private requestsService: RequestService,
                private router: Router,
                private fb: FormBuilder,
                private toastService: ToastrService,) {
        this.appService.setShowDocInfoPaneSubjectState(this.showDocInfoPane);
    }

    ngOnInit(): void {
        this.appService.showDocInfoPaneSubject.subscribe((value: boolean) => {
            this.showDocInfoPane = value;
        });
        this.setInitialProps();
        this.activatedRoute.queryParams.subscribe((params: any) => {
            this.queryParams = params;
            const folderId = this.queryParams.folderId ? this.queryParams.folderId : 0
            this.loadDocumentLibrary(folderId, false);
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
    
    createSharedLinkAction() {
        if (this.shareWithUserForm.get('shareType')?.value !== 'ANYONE') {
            this.createSharedLink = false;
            this.toastService.error('You can\'t generate link', 'Share Document');
            return;
        }
        this.createSharedLink = !this.createSharedLink;
    }
    
    copyLinkToClipboard(shareLink: any) {
        shareLink.select();
        document.execCommand('copy');
        shareLink.setSelectionRange(0, 0);
        this.toastService.success('Share Link has been copied.', 'Share Document');
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
                        this.dlDocuments = this.dlDocuments.filter(doc => !doc.folder);
                        this.findCurrentFileFromDocs();
                    } else {
                        this.dlDocuments = [];
                    }
                },
                error: (error: any) => {
                    this.appService.handleError(error, 'Document Library');
                }
            });
    }

    favouriteDocument(row: any) {
        const isChecked = !row.favorite;
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
            openURl += '&name=' + window.btoa(this.selectedDoc.name || '');
            // openURl += '&tenantId=' + window.atob(localStorage.getItem(btoa('tenantId')));
        } else {
            openURl += '/share/document-view?guid=';
            openURl += this.selectedDoc.versionGUId;
            // openURl += this.selectedDoc?.versionName;
            // openURl += '&tenantId=' + window.atob(localStorage.getItem(window.btoa('tenantId')));
            openURl += '&fromFolderShared=' + false;
        }
        return openURl;
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
    
    onShare(data: any) {
        if (data.shareType === 'RESTRICTED') {
            if (data.collaborators.length <= 0) {
                this.toastService.error('You can\'nt share without adding collaborator.', 'Share Document');
                return;
            }
        }
        let userId = Number(localStorage.getItem(window.btoa(AppConstants.AUTH_USER_ID)));
        let shareObj = {
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
        this.requestsService.postRequest(ApiUrlConstants.DL_DOCUMENT_SHARE_API_URL, shareObj)
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
        this.router.navigate(['/doc-lib']);
    }
    
    // share code
    showShareDocumentDialog() {
        this.shareWithUserForm.patchValue({
            message: null,
            publicUrlLink: null,
            shareType: 'ANYONE',
            collaborators: null,
            sharePermission: 'VIEW',
            departmentId: null
        });
        this.createSharedLink = false;
        this.shareDocumentDialog = true;
    }
    
    hideShareDocumentDialog() {
        this.shareDocumentDialog = false;
    }

}
