import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {AppService} from "../../../service/app.service";
import {ApiUrlConstants} from "../../../util/api.url.constants";
import {HttpResponse} from "@angular/common/http";
import {FormBuilder, FormGroup} from "@angular/forms";
import {RequestService} from "../../../service/request.service";
import {ToastrService} from "ngx-toastr";
import {MenuItem} from "primeng/api";
import {AppConstants} from "../../../util/app.constants";

@Component({
    selector: 'doc-info-pane-component',
    templateUrl: './sbm-doc-info-pane.template.html',
    styleUrls: [
        '../../doc-lib/doc-info-pane/doc-info-pane.component.less',
        './sbm-doc-info-pane.component.less'
    ]
})
export class SbmDocInfoPaneComponent implements OnInit, OnChanges {

    documentMeta: any;
    users: any[] = [];
    comments: any[] = [];
    sharingDetails: any[] = [];
    enableEditComment: boolean = false;
    sharingMenuItems: MenuItem[] = [];
    activeTabIndex: number = 0;
    selectedShareDoc: any;
    validExtensions: string[] = AppConstants.VALID_EXTENSIONS;
    commentForm: FormGroup = new FormGroup({});

    constructor(public appService: AppService,
                private requestsService: RequestService,
                private fb: FormBuilder,
                private toastService: ToastrService) {
    }

    @Input() _selectedDoc: any = null;

    get selectedDoc(): any {
        return this._selectedDoc;
    }

    @Input('selectedDoc') set selectedDoc(selectedDoc: any) {
        this._selectedDoc = selectedDoc;
        this.activeTabIndex = 0;
    }

    ngOnInit(): void {
        this.buildForms();
        this.buildOptionItems();
    }

    buildOptionItems() {
        this.sharingMenuItems = [
            {
                label: 'Viewer',
                icon: 'icon-eye',
                command: () => this.updateSharingPermission(this.selectedShareDoc, 'VIEW'),
                // styleClass: 'p-menuitem-active',
            },
            {
                label: 'Comment',
                icon: 'icon-edit',
                command: () => this.updateSharingPermission(this.selectedShareDoc, 'COMMENT')
            },
            {
                label: 'Remove',
                icon: 'icon-trash',
                command: () => this.removeSharing(this.selectedShareDoc)
            }
        ];
    }

    ngOnChanges(): void {
        this.getMetaDocumentByID();
    }

    buildForms() {
        this.commentForm = this.fb.group({
            id: [''],
            comments: [''],
        });
    }

    onMenuClicked(data: any) {
        this.selectedShareDoc = data;
        if (this.selectedShareDoc.accessRight == 'VIEW') {
            this.sharingMenuItems = [
                {
                    label: 'Comment',
                    icon: 'icon-edit',
                    command: () => this.updateSharingPermission(this.selectedShareDoc, 'COMMENT')
                },
                {
                    label: 'Remove',
                    icon: 'icon-trash',
                    command: () => this.removeSharing(this.selectedShareDoc)
                }
            ];
        } else if (this.selectedShareDoc.accessRight == 'COMMENT') {
            this.sharingMenuItems = [
                {
                    label: 'Viewer',
                    icon: 'icon-eye',
                    command: () => this.updateSharingPermission(this.selectedShareDoc, 'VIEW'),
                },
                {
                    label: 'Remove',
                    icon: 'icon-trash',
                    command: () => this.removeSharing(this.selectedShareDoc)
                }
            ];
        } else {
            this.sharingMenuItems = [
                {
                    label: 'Viewer',
                    icon: 'icon-eye',
                    command: () => this.updateSharingPermission(this.selectedShareDoc, 'VIEW'),
                },
                {
                    label: 'Comment',
                    icon: 'icon-edit',
                    command: () => this.updateSharingPermission(this.selectedShareDoc, 'COMMENT')
                },
                {
                    label: 'Remove',
                    icon: 'icon-trash',
                    command: () => this.removeSharing(this.selectedShareDoc)
                }
            ];
        }
    }

    updateSharingPermission(shareData: any, permission: string) {
        if (this.selectedDoc && shareData) {
            let url = ApiUrlConstants.DL_DOCUMENT_SHARE_UPDATE_PERMISSION_API_URL
                .replace("{dlDocId}", String(this.selectedDoc.id))
                .replace("{collId}", String(shareData.dlCollId))
                .replace("{accessRight}", permission);
            this.requestsService.putRequest(url, {})
                .subscribe({
                        next: (response: HttpResponse<any>) => {
                            if (response.status === 200) {
                                this.toastService.success('Document permission has been updated', 'Update Permission');
                                this.loadDlDocumentDetails({index: 2});
                            }
                        },
                        error: (error: any) => {
                            this.appService.handleError(error, 'Update Permission');
                        }
                    }
                );
        }
    }

    removeSharing(shareData: any) {
        if (this.selectedDoc && shareData && shareData.dlCollId) {
            this.requestsService.deleteRequest(ApiUrlConstants.REMOVE_COLLABORATOR_SHARE_API_URL
                .replace('{dlDocId}', String(this.selectedDoc.id)).replace('{collabId}', String(shareData.dlCollId)))
                .subscribe({
                    next: (response: any) => {
                        if (response.status === 200) {
                            this.toastService.success(response.body.message, 'Remove Collaborator');
                            this.loadDlDocumentDetails({index: 2});
                        }
                    },
                    error: (error: any) => {
                        this.appService.handleError(error, 'Remove Collaborator');
                    }
                });
        }
    }

    getMetaDocumentByID() {
        if (this.selectedDoc && this.selectedDoc > 0) {
            this.requestsService.getRequest(ApiUrlConstants.DL_DOCUMENT_API_URL
                .replace("{dlDocumentId}", String(this.selectedDoc)))
                .subscribe({
                    next: (response: HttpResponse<any>) => {
                        if (response.status === 200) {
                            this.documentMeta = response.body.data;
                        } else {
                            this.documentMeta = [];
                        }
                    },
                    error: (error: any) => {
                        this.appService.handleError(error, 'Document Library');
                    }
                });
        }
    }

    toggleDocInfoPane() {
        this.appService.setDocInfoPaneState(!this.appService.docInfoPaneState);
    }

    loadDlDocumentDetails(event: any) {
        //When no document selected then return
        //And don't call api
        if(!this.selectedDoc.id) return;
        this.activeTabIndex = event.index;
        if (event.index == 1) {
            let url = ApiUrlConstants.DL_DOCUMENT_COMMENT_API_URL + '?documentId=' + this.selectedDoc.id;
            this.requestsService.getRequest(url)
                .subscribe({
                    next: (response: any) => {
                        if (response.status === 200) {
                            this.comments = response.body.data;
                        } else {
                            this.comments = [];
                        }
                    },
                    error: (error: any) => {
                        this.appService.handleError(error, 'Comment');
                    }
                });
        } else if (event.index == 2) {
            if (this.selectedDoc.shared != null) {
                let url = ApiUrlConstants.DL_DOCUMENT_SHARE_DETAIL_API_URL + this.selectedDoc.id;
                this.requestsService.getRequest(url)
                    .subscribe({
                        next: (response: any) => {
                            if (response.status === 200) {
                                this.sharingDetails = response.body.data;
                            } else {
                                this.sharingDetails = [];
                            }
                        },
                        error: (error: any) => {
                            this.appService.handleError(error, 'Sharing Details');
                        }
                    });
            }
        }
    }

    addUserComment() {
        let comments = this.commentForm.value.comments;
        let trimmedComments = comments.trim();
        if (trimmedComments.length == 0) {
            this.toastService.warning('Empty comment can\'t be posted.', 'Comment');
            return;
        }
        let data = {
            message: this.commentForm.value.comments,
            docId: this.selectedDoc.id,
            userId: this.appService.userInfo.id,
            createdBy: this.appService.userInfo.id,
            updatedBy: this.appService.userInfo.id
        };
        this.requestsService.postRequest(ApiUrlConstants.DL_DOCUMENT_COMMENT_API_URL, data)
            .subscribe({
                next: (response: HttpResponse<any>) => {
                    if (response.status === 200) {
                        this.commentForm.reset();
                        this.toastService.success('Comment added successfully', 'Comment');
                        this.loadDlDocumentDetails({index: 1});
                    }
                },
                error: (error: any) => {
                    this.appService.handleError(error, 'Comment');
                }
            });
    }

    onEditComment(selectedComment: any) {
        if (selectedComment.userId !== Number.parseInt(this.appService.userInfo.id)) {
            this.appService.noRightsMessage();
            return;
        }
        this.enableEditComment = true;
        this.commentForm.patchValue({
            id: selectedComment.id,
            comments: selectedComment.message
        });
    }

    updateUserComment() {
        let comments = this.commentForm.value.comments;
        let trimmedComments = comments.trim();
        if (trimmedComments.length == 0) {
            this.toastService.warning('Empty comment can\'t be posted.', 'Comment');
            return;
        }
        let data = {
            id: this.commentForm.value.id,
            message: this.commentForm.value.comments,
            docId: this.selectedDoc.id,
            userId: this.appService.userInfo.id,
            createdBy: this.appService.userInfo.id,
            updatedBy: this.appService.userInfo.id
        };
        this.requestsService.putRequest(ApiUrlConstants.DL_DOCUMENT_COMMENT_API_URL, data)
            .subscribe({
                next: (response: HttpResponse<any>) => {
                    if (response.status === 200) {
                        this.commentForm.reset();
                        this.enableEditComment = false;
                        this.toastService.success('Comment updated successfully', 'Comment');
                        this.loadDlDocumentDetails({index: 1});
                    }
                },
                error: (error: any) => {
                    this.appService.handleError(error, 'Comment');
                }
            });
    }

    onDeleteComment(selectedComment: any) {
        if (selectedComment.userId !== Number.parseInt(this.appService.userInfo.id)) {
            this.appService.noRightsMessage();
            return;
        }
        this.requestsService.deleteRequest(ApiUrlConstants.DL_DOCUMENT_COMMENT_API_URL + '/' + selectedComment.id)
            .subscribe({
                next: (response: any) => {
                    if (response.status === 200) {
                        this.loadDlDocumentDetails({index: 1});
                    }
                },
                error: (error: any) => {
                    this.appService.handleError(error, 'Comment');
                }
            });
    }

}
