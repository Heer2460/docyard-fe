import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {AppService} from "../../../service/app.service";
import {ApiUrlConstants} from "../../../util/api.url.constants";
import {HttpResponse} from "@angular/common/http";
import {FormBuilder, FormGroup} from "@angular/forms";
import {RequestService} from "../../../service/request.service";
import {MenuItem} from "primeng/api";

@Component({
    selector: 'doc-info-pane-component',
    templateUrl: './doc-info-pane.template.html',
    styleUrls: ['./doc-info-pane.component.less']
})
export class DocInfoPaneComponent implements OnInit, OnChanges {
    
    @Input() _selectedDoc: any = null;
    
    documentMeta: any;
    users: any[] = [];
    showDocInfoPane: boolean = false;
    enableEditComment: boolean = false;
    sharingMenuItems: MenuItem[] = [];
    activeTabIndex: number = 0;
    
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
        this.buildOptionItems();
    }
    
    @Input('selectedDoc') set selectedDoc(selectedDoc: any) {
        this._selectedDoc = selectedDoc;
        this.activeTabIndex = 0;
    }
    
    get selectedDoc(): any {
        return this._selectedDoc;
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
    
    updateUserComment() {
        this.appService.successUpdateMessage('Comment Update');
        this.commentForm.reset();
        this.enableEditComment = false;
    }
    
    onAccordionOpen(event: any) {
        this.activeTabIndex = event.index
    }
    
}
