import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {ConfirmationService, MenuItem} from "primeng/api";
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

@Component({
    selector: 'trash-component',
    templateUrl: './trash.component.html',
    styleUrls: ['./trash.component.less']
})
export class TrashComponent implements OnInit {

    @ViewChild('fileUpload') fileUpload: ElementRef | undefined;
    @ViewChild('folderUpload') folderUpload: ElementRef | undefined;

    menuItems: MenuItem[] = [];
    dlDocuments: any[] = [];
    selectedDoc: DlDocumentDTO = new DlDocumentDTO();
    showGridDisplay: boolean = false;
    validExtensions: string[] = AppConstants.VALID_EXTENSIONS;
    breadcrumbs: BreadcrumbDTO[] = [
        {
            label: 'Home',
            route: '/home',
            active: false
        },
        {
            label: 'Trash',
            route: '/trash',
            active: true
        }
    ];
    title: string = 'Trash';
    deleteFlag: boolean = false;

    constructor(public appService: AppService,
                private router: Router,
                private fb: FormBuilder,
                public appUtility: AppUtility,
                private requestsService: RequestService,
                private toastService: ToastrService,
                private confirmationService: ConfirmationService) {
    }

    ngOnInit(): void {
        this.buildDocumentActions();
        this.loadTrashDLDocuments();
    }

    buildDocumentActions() {
        this.menuItems = [
            {
                label: 'Restore',
                icon: 'icon-restore',
                command: () => this.onConfirmDialogueOpen(this.selectedDoc, 'restore', true)
            },
            {
                label: 'Delete',
                icon: 'icon-trash',
                command: () => this.onConfirmDialogueOpen(this.selectedDoc, 'delete', true)
            }
        ];
    }

    loadTrashDLDocuments() {
        let loggedInUser = this.appService.getLoggedInUserId();
        this.requestsService.getRequest(ApiUrlConstants.GET_ALL_TRASH_DL_DOCUMENTS_API_URL + loggedInUser)
            .subscribe({
                next: (response: HttpResponse<any>) => {
                    if (response.status === 200) {
                        this.dlDocuments = response.body.data;
                    } else {
                        this.dlDocuments = [];
                    }
                },
                error: (error: any) => {
                    this.appService.handleError(error, 'Trash');
                }
            });
    }

    onMenuClicked(data: DlDocumentDTO) {
        this.selectedDoc = data;
    }

    setGridDisplay() {
        this.showGridDisplay = true;
    }

    setListDisplay() {
        this.showGridDisplay = false;
    }

    onConfirmDialogueOpen(data: any, type: string, single: boolean) {
        let array: any[] = [];
        switch (type) {
            case "delete":
                this.deleteFlag = true;
                switch (single) {
                    case true:
                        array.push(data.id);
                        this.confirmationService.confirm({
                            message: `Are you sure you want to delete this ${data.folder == true ? 'folder' : 'file'}?`,
                            header: `Delete ${data.folder == true ? 'Folder' : 'File'}`,
                            accept: () => {
                                this.onDeleteDocument(array)
                            }
                        });
                        break;
                    case false:
                        this.dlDocuments.map(item => array.push(item.id));
                        this.confirmationService.confirm({
                            message: 'Are you sure you want to delete all documents?',
                            header: 'Delete All',
                            accept: () => {
                                this.onDeleteDocument(array)
                            }
                        });
                        break;
                }
                break;

            case "restore":
                this.deleteFlag = false;
                switch (single) {
                    case true:
                        array.push(data.id);
                        this.confirmationService.confirm({
                            message: `Are you sure you want to restore this ${data.folder == true ? 'folder' : 'file'}?`,
                            header: `Restore ${data.folder == true ? 'Folder' : 'File'}`,
                            accept: () => {
                                this.onRestoreDocument(array)
                            }
                        });
                        break;
                    case false:
                        this.dlDocuments.map(item => array.push(item.id));
                        this.confirmationService.confirm({
                            message: 'Are you sure you want to restore all documents?',
                            header: 'Restore All',
                            accept: () => {
                                this.onRestoreDocument(array)
                            }
                        });
                        break;
                }
                break;
        }
    }

    onRestoreDocument(ids: any[]) {
        let data = {
            dlDocumentIds: ids
        };
        this.requestsService.putRequest(ApiUrlConstants.RESTORE_DOCUMENT_API_URL, data)
            .subscribe({
                    next: (response: HttpResponse<any>) => {
                        if (response.status === 200) {
                            this.toastService.success('Document has been restore successfully.', 'Restore');
                            this.loadTrashDLDocuments();
                        }
                    },
                    error: (error: any) => {
                        this.appService.handleError(error, 'Restore');
                    }
                }
            );
    }

    onDeleteDocument(ids: any) {
        /*let data = {
            dlDocumentIds: ids
        };
        this.requestsService.putRequest(ApiUrlConstants.RESTORE_DOCUMENT_API_URL, data)
            .subscribe({
                    next: (response: HttpResponse<any>) => {
                        if (response.status === 200) {
                            this.toastService.success('Document has been deleted successfully.', 'Trash');
                            this.loadTrashDLDocuments();
                        }
                    },
                    error: (error: any) => {
                        this.appService.handleError(error, 'Trash');
                    }
                }
            );*/
    }
}
