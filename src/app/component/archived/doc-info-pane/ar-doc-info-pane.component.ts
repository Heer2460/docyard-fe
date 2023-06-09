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
    selector: 'ar-doc-info-pane-component',
    templateUrl: './ar-doc-info-pane.template.html',
    styleUrls: [
        '../../doc-lib/doc-info-pane/doc-info-pane.component.less',
        './ar-doc-info-pane.component.less'
    ]
})
export class ArDocInfoPaneComponent implements OnInit, OnChanges {

    documentMeta: any;
    users: any[] = [];
    comments: any[] = [];
    sharingDetails: any[] = [];
    enableEditComment: boolean = false;
    sharingMenuItems: MenuItem[] = [];
    activeTabIndex: number = 0;
    validExtensions: string[] = AppConstants.VALID_EXTENSIONS;
    commentForm: FormGroup = new FormGroup({});
    commentar: boolean = false;
    @Input() _selectedDoc: any = null;

    constructor(public appService: AppService,
                private requestsService: RequestService,
                private fb: FormBuilder,
                private toastService: ToastrService) {
    }

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
                command: () => {
                }
            },
            {
                label: 'Comment',
                icon: 'icon-edit',
                command: () => {
                }
            },
            /*{
                label: 'Editor',
                icon: 'icon-edit',
                command: () => {
                }
            },*/
            {
                label: 'Remove',
                icon: 'icon-trash',
                command: () => {
                }
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
            if (this.selectedDoc.dlShareId) {
                this.getShareDocDetails(this.selectedDoc.dlShareId);
            }
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

    getShareDocDetails(id: any) {
        this.requestsService.getRequest(ApiUrlConstants.GET_DL_DOCUMENT_SHARE_DETAIL_API_URL.replace('{dlDocumentId}', id))
            .subscribe({
                next: (response: any) => {
                    if (response.status === 200) {
                        if (response.body.data.shareType === 'ANYONE') {
                            this.commentar = response.body.data.accessRight === 'COMMENT';
                        } else if (response.body.data.shareType === 'RESTRICTED') {
                            const data = response.body.data.dlShareCollaboratorDTOList.find((item: { dlCollaboratorEmail: any; }) => item.dlCollaboratorEmail === this.appService.userInfo.email);
                            if (data) {
                                this.commentar = data.accessRight === 'COMMENT';
                            } else {
                                this.commentar = false;
                            }
                        }
                    } else {
                        this.commentar = false;
                    }
                },
                error: (error: any) => {
                    this.appService.handleError(error, 'Share Document');
                }
            });
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
