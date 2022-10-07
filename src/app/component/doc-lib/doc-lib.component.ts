import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {MenuItem} from "primeng/api";
import {AppService} from "../../service/app.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AppUtility} from "../../util/app.utility";
import {ApiUrlConstants} from "../../util/api.url.constants";
import {HttpResponse} from "@angular/common/http";
import {RequestService} from "../../service/request.service";
import {DocDataTableComponent} from "../shared/doc-data-table/doc-data-table.component";
import {DlDocumentDTO} from "../../model/settings/doc-handling/dl-document.dto";
import {AppConstants} from "../../util/app.constants";
import {BreadcrumbDTO} from "../../model/breadcrumb.dto";

@Component({
    selector: 'doc-lib-component',
    templateUrl: './doc-lib.template.html',
    styleUrls: ['./doc-lib.component.less']
})
export class DocLibComponent implements OnInit {
    
    @ViewChild('fileUpload') fileUpload: ElementRef | undefined;
    @ViewChild('folderUpload') folderUpload: ElementRef | undefined;
    @ViewChild('docDataTableComponent') docDataTableComponent: DocDataTableComponent | undefined;
    
    addFolderForm: FormGroup = new FormGroup({});
    addFileForm: FormGroup = new FormGroup({});
    menuItems: MenuItem[] = [];
    uploadMenuItems: MenuItem[] = [];
    createMenuItems: MenuItem[] = [];
    visibleAddFolderDialog: boolean = false;
    //visibleAddFileDialog: boolean = false;
    dlDocuments: any[] = [];
    showDocInfoPane: boolean = true;
    showGridDisplay: boolean = false;
    
    breadcrumbs: BreadcrumbDTO[] = [
        {
            label: 'Home',
            route: '/home',
            active: false
        },
        {
            label: 'Document Library',
            route: '/doc-lib',
            active: true
        }
    ];
    
    title: string = 'Document Library';
    
    constructor(public appService: AppService,
                private fb: FormBuilder,
                public appUtility: AppUtility,
                private requestsService: RequestService) {
        this.appService.showDocInfoPaneSubject.subscribe((value: boolean) => {
            this.showDocInfoPane = value;
        });
        this.openFolder();
    }
    
    ngOnInit(): void {
        this.buildDocumentActions();
        this.buildOptionItems();
        this.buildForms();
        this.loadDocumentLibrary(this.appService.getSelectedFolderId(), false);
    }
    
    buildDocumentActions() {
        this.menuItems = [
            {
                label: 'Share',
                icon: 'icon-share',
                command: () => {
                }
            },
            {
                label: 'Download',
                icon: 'icon-download',
                command: () => {
                }
            },
            {
                label: 'Delete',
                icon: 'icon-trash',
                command: () => {
                }
            },
            {
                label: 'Rename',
                icon: 'icon-edit',
                command: () => {
                }
            }
        ];
    }
    
    buildOptionItems() {
        this.createMenuItems = [
            {
                label: 'Folder',
                icon: 'icon-folder-plus',
                command: () => this.showAddFolderPopup()
            },
            /*{
                label: 'Text File',
                icon: 'icon-file-plus',
                command: () => this.showAddFilePopup()
            }*/
        ];
        this.uploadMenuItems = [
            {
                label: 'File',
                icon: 'icon-file-plus',
                command: () => this.fileUpload?.nativeElement.click()
            },
            {
                label: 'Folder',
                icon: 'icon-folder-plus',
                command: () => this.folderUpload?.nativeElement.click()
            }
        ];
    }
    
    buildForms() {
        this.addFolderForm = this.fb.group({
            name: [null, [Validators.required, Validators.maxLength(17)]],
        });
        this.addFileForm = this.fb.group({
            name: [null, [Validators.required, Validators.maxLength(17)]],
        });
    }
    
    // creating
    showAddFolderPopup() {
        this.addFolderForm.patchValue({
            name: '',
        });
        this.addFolderForm.markAsUntouched();
        this.visibleAddFolderDialog = true;
    }
    
    hideAddFolderPopup() {
        this.visibleAddFolderDialog = false;
    }
    
    // updating
    uploadFile(event: any) {
        console.log('Single:', event.target.files[0]);
    }
    
    uploadFolder(event: any) {
        console.log('Dir: ', event.target.files);
        
        for (let i = 0; i < event.target.files.length; i++) {
            const file = event.target.files[i];
            const path = file.webkitRelativePath.split('/');
            
        }
    }
    
    loadDocumentLibrary(folderId: string, archived: boolean) {
        this.requestsService.getRequest(ApiUrlConstants.GET_ALL_DL_DOCUMENT_API_URL
            .replace("{folderId}", folderId).replace("{archived}", String(archived)))
            .subscribe({
                next: (response: HttpResponse<any>) => {
                    if (response.status === 200) {
                        this.dlDocuments = response.body.data;
                    } else {
                        this.dlDocuments = [];
                    }
                },
                error: (error: any) => {
                    this.appService.handleError(error, 'Document Library');
                }
            });
    }
    
    createFolder() {
        if (this.addFolderForm.invalid) {
            return;
        }
        let dlDocumentDTO: DlDocumentDTO = new DlDocumentDTO();
        dlDocumentDTO.convertToDTO(this.addFolderForm.value);
        dlDocumentDTO.parentId = this.appService.getSelectedFolderId() == '0' ? null : this.appService.getSelectedFolderId();
        
        if (dlDocumentDTO) {
            this.requestsService.postRequest(ApiUrlConstants.CREATE_FOLDER_API_URL, dlDocumentDTO)
                .subscribe({
                    next: (response: HttpResponse<any>) => {
                        if (response.status === 200) {
                            this.appService.successAddMessage('Document Library');
                            this.loadDocumentLibrary(this.appService.getSelectedFolderId(), false);
                            this.hideAddFolderPopup();
                        }
                    },
                    error: (error: any) => {
                        this.appService.handleError(error, 'Document Library');
                    }
                });
        }
    }
    
    openFolder() {
        this.appService.currentFolderIdSubject.subscribe((dlFolderId: any) => {
            if (dlFolderId != '') {
                this.loadDocumentLibrary(dlFolderId, false);
                localStorage.setItem(window.btoa(AppConstants.SELECTED_FOLDER_ID), dlFolderId);
            }
        });
    }
    
    setGridDisplay() {
        this.appService.setGridDisplaySubjectState(true);
    }
    
    setListDisplay() {
        this.appService.setGridDisplaySubjectState(false);
    }
    
}
