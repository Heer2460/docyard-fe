import {Component, Input, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import {AppService} from "../../../service/app.service";
import {ApiUrlConstants} from "../../../util/api.url.constants";
import {HttpResponse} from "@angular/common/http";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AppUtility} from "../../../util/app.utility";
import {RequestService} from "../../../service/request.service";
import {CustomValidations} from "../../../util/custom.validations";

@Component({
    selector: 'doc-info-pane-component',
    templateUrl: './doc-info-pane.template.html',
    styleUrls: ['./doc-info-pane.component.less']
})
export class DocInfoPaneComponent implements OnInit, OnChanges {

    @Input() selectedDoc: any = null;

    documentMeta: any;
    users: any[] = [];
    showDocInfoPane: boolean = false;
    enableEditComment: boolean = false;
    
    commentForm: FormGroup = new FormGroup({});

    constructor(public appService: AppService,
                private requestsService: RequestService,
                private fb: FormBuilder) {
        this.appService.showDocInfoPaneSubject.subscribe((value: boolean) => {
            this.showDocInfoPane = value;
        });
    }

    ngOnChanges(): void {
        this.getMetaDocumentByID();
    }

    ngOnInit(): void {
        this.buildForms();
    }
    
    buildForms() {
        this.commentForm = this.fb.group({
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
    
    addUserComment() {
        this.appService.successAddMessage('Add Comment');
    }
    
    onEditCommentBtnClicked() {
        this.enableEditComment = true;
        this.commentForm.patchValue({
            comments: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra`
        });
    }
    
    onCancelEditCommentBtnClicked(){
        this.enableEditComment = false;
    }
    
    updateUserComment() {
        this.appService.successUpdateMessage('Comment Update');
        this.commentForm.reset();
        this.enableEditComment = false;
    }

}
