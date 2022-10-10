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
    showDocInfoPane: boolean = true;
    showGridDisplay: boolean = false;
    dlFolderId: any;
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
    breadcrumbItemsToShow: any = 4;
    breadcrumbCollapsedItems: any[] = [];
    title: string = 'Trash';

    constructor(public appService: AppService,
                private router: Router,
                private fb: FormBuilder,
                public appUtility: AppUtility,
                private requestsService: RequestService,
                private toastService: ToastrService,
                private confirmationService: ConfirmationService) {
        this.appService.showDocInfoPaneSubject.subscribe((value: boolean) => {
            this.showDocInfoPane = value;
        });
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
                command: () => {
                }
            },
            {
                label: 'Delete',
                icon: 'icon-trash',
                command: () => {
                }
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

    onItemDeleteAction(data: any) {
        this.confirmationService.confirm({
            message: `Are you sure you want to delete this ${data.folder == true ? 'folder' : 'file'}?`,
            accept: () => {
                this.onDeleteDocument(data.id)
            }
        });
    }

    onDeleteDocument(id: any) {
        let url = ApiUrlConstants.DL_DOCUMENT_ARCHIVED_API_URL.replace("{dlDocumentId}", String(id))
            .replace("{archived}", 'true');
        this.requestsService.putRequest(url, {})
            .subscribe({
                    next: (response: HttpResponse<any>) => {
                        if (response.status === 200) {
                            this.appService.successDeleteMessage('Trash');
                            this.loadTrashDLDocuments();
                        }
                    },
                    error: (error: any) => {
                        this.appService.handleError(error, 'Trash');
                    }
                }
            );
    }
}
