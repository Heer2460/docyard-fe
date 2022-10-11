import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {AppService} from "../../../service/app.service";
import {ApiUrlConstants} from "../../../util/api.url.constants";
import {HttpResponse} from "@angular/common/http";
import {FormBuilder, FormGroup} from "@angular/forms";
import {RequestService} from "../../../service/request.service";
import {ToastrService} from "ngx-toastr";
import {MenuItem} from "primeng/api";

@Component({
    selector: 'doc-info-pane-component',
    templateUrl: './doc-info-pane.template.html',
    styleUrls: ['./doc-info-pane.component.less']
})
export class DocInfoPaneComponent implements OnInit, OnChanges {

    documentMeta: any;
    users: any[] = [];
    comments: any[] = [];
    showDocInfoPane: boolean = false;
    enableEditComment: boolean = false;
    sharingMenuItems: MenuItem[] = [];
    activeTabIndex: number = 0;
    commentForm: FormGroup = new FormGroup({});

    constructor(public appService: AppService,
                private requestsService: RequestService,
                private fb: FormBuilder,
                private toastService: ToastrService) {
        this.appService.showDocInfoPaneSubject.subscribe((value: boolean) => {
            this.showDocInfoPane = value;
        });
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
                command: () => {
                }
            },
            {
                label: 'Editor',
                icon: 'icon-edit',
                command: () => {
                }
            },
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
        this.appService.setShowDocInfoPaneSubjectState(!this.showDocInfoPane);
    }

    loadComments(event: any) {
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
        }
    }

    addUserComment() {
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
                        this.loadComments({index: 1});
                    }
                },
                error: (error: any) => {
                    this.appService.handleError(error, 'Comment');
                }
            });
    }

    onEditCommentBtnClicked(selectedComment: any) {
        this.enableEditComment = true;
        this.commentForm.patchValue({
            id: selectedComment.id,
            comments: selectedComment.message
        });
    }

    updateUserComment() {
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
                        this.loadComments({index: 1});
                    }
                },
                error: (error: any) => {
                    this.appService.handleError(error, 'Comment');
                }
            });
    }

    onCancelEditCommentBtnClicked() {
        this.enableEditComment = false;
    }

    onAccordionOpen(event: any) {
        this.activeTabIndex = event.index
    }

}
