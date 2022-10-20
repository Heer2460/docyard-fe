import {Component, OnInit} from '@angular/core';
import {ConfirmationService, MenuItem} from "primeng/api";
import {ApiUrlConstants} from "../../util/api.url.constants";
import {HttpResponse} from "@angular/common/http";
import {RequestService} from "../../service/request.service";
import {AppService} from "../../service/app.service";
import {AppConstants} from "../../util/app.constants";
import {AppUtility} from "../../util/app.utility";
import * as FileSaver from "file-saver";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DlDocumentDTO} from "../../model/settings/doc-handling/dl-document.dto";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";

@Component({
    selector: 'home-component',
    templateUrl: './home.template.html',
    styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

    renameDocumentForm: FormGroup = new FormGroup({});
    userInfo: any;
    renameDocumentDialog: boolean = false;
    menuItems: MenuItem[] = [
        {
            label: 'Share',
            icon: 'icon-share',
            command: () => {
            }
        },
        {
            label: 'Download',
            icon: 'icon-download',
            command: () => this.downloadFile(this.selectedDoc)
        },
        {
            label: 'Rename',
            icon: 'icon-edit',
            command: () => this.showRenameDocumentPopup(this.selectedDoc)
        },
        {
            label: 'Delete',
            icon: 'icon-trash',
            command: () => this.onItemDeleteAction(this.selectedDoc)
        }
    ];
    recentDocs: any[] = [];
    selectedDoc: DlDocumentDTO = new DlDocumentDTO();
    validExtensions: string[] = AppConstants.VALID_EXTENSIONS;

    constructor(private requestsService: RequestService,
                private appService: AppService,
                private fb: FormBuilder,
                public appUtility: AppUtility,
                private toastService: ToastrService,
                private router: Router,
                private confirmationService: ConfirmationService) {
        let userData: any = localStorage.getItem(window.btoa(AppConstants.AUTH_USER_INFO));
        this.userInfo = JSON.parse(userData);
    }

    ngOnInit(): void {
        this.getRecentDocument();
        this.buildForms();
    }

    buildForms() {
        this.renameDocumentForm = this.fb.group({
            name: [null, [Validators.required, Validators.maxLength(255)]],
        });
    }

    onMenuClicked(data: DlDocumentDTO) {
        this.selectedDoc = data;
    }

    getDashboardStats() {
        let loggedInUser = this.appService.getLoggedInUserId();
        this.requestsService.getRequest(ApiUrlConstants.DASHBOARD_STATS_API_URL.replace('{userId}', String(loggedInUser)))
            .subscribe({
                next: (response: HttpResponse<any>) => {
                    if (response.status === 200) {
                        this.recentDocs = response.body.data;
                    } else {
                        this.recentDocs = [];
                    }
                },
                error: (error: any) => {
                    this.appService.handleError(error, 'Dashboard');
                }
            });
    }

    getRecentDocument() {
        let loggedInUser = this.appService.getLoggedInUserId();
        let url = ApiUrlConstants.GET_RECENT_DOCUMENT_API_URL + loggedInUser;
        this.requestsService.getRequest(url)
            .subscribe({
                next: (response: HttpResponse<any>) => {
                    if (response.status === 200) {
                        this.recentDocs = response.body.data;
                    } else {
                        this.recentDocs = [];
                    }
                },
                error: (error: any) => {
                    this.appService.handleError(error, 'Recent Documents');
                }
            });
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
                            this.appService.successDeleteMessage('Recent Documents');
                            this.getRecentDocument();
                        }
                    },
                    error: (error: any) => {
                        this.appService.handleError(error, 'Recent Documents');
                    }
                }
            );
    }

    showRenameDocumentPopup(data: any) {
        this.renameDocumentForm.patchValue({name: ''});
        this.renameDocumentForm.markAsUntouched();
        this.renameDocumentForm.patchValue({name: data.title});
        this.renameDocumentDialog = true;
    }

    hideRenameDocumentPopup() {
        this.renameDocumentDialog = false;
    }

    onRenameDocument() {
        let data = {
            id: this.selectedDoc.id,
            title: this.renameDocumentForm.value.name,
            updatedBy: localStorage.getItem(window.btoa(AppConstants.AUTH_USER_ID))
        };
        this.requestsService.putRequest(ApiUrlConstants.DL_DOCUMENT_RENAME_API_URL, data)
            .subscribe({
                    next: (response: HttpResponse<any>) => {
                        if (response.status === 200) {
                            this.appService.successUpdateMessage('Rename Document');
                            this.hideRenameDocumentPopup();
                            this.getRecentDocument();
                        }
                    },
                    error: (error: any) => {
                        this.appService.handleError(error, 'Rename Document');
                    }
                }
            );

    }

    downloadFile(data: any) {
        this.requestsService.getRequestFile(ApiUrlConstants.DOWNLOAD_DL_DOCUMENT_API_URL.replace("{dlDocumentId}", data.id))
            .subscribe({
                next: (response: any) => {
                    let mimeType = AppUtility.getMimeTypeByFileName(data.name);
                    let blob = new Blob([response], {type: mimeType});
                    FileSaver.saveAs(blob, data.name);
                    this.toastService.success('Document downloaded successfully.', 'Recent Documents');
                },
                error: (error: any) => {
                    this.appService.handleError(error, 'Recent Documents');
                }
            });
    }

    openProfile(data: any) {
        let loggedInUserId = this.appService.getLoggedInUserId();
        if (data.updatedBy === Number.parseInt(String(loggedInUserId))) {
            this.router.navigate(['/profile']);
        }
    }
}
