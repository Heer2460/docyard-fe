import {Component, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";
import {DlDocumentDTO} from "../../model/settings/doc-handling/dl-document.dto";
import {AppConstants} from "../../util/app.constants";
import {BreadcrumbDTO} from "../../model/breadcrumb.dto";
import {HttpResponse} from "@angular/common/http";
import {AppService} from "../../service/app.service";
import {RequestService} from "../../service/request.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiUrlConstants} from "../../util/api.url.constants";

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.less']
})
export class SearchComponent implements OnInit {

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
            label: 'Document Library',
            route: '/doc-lib',
            active: false
        },
        {
            label: 'Search',
            route: '/search',
            active: true
        }
    ];
    title: string = 'Search';
    searchValue: string = '';

    constructor(private appService: AppService,
                private requestsService: RequestService,
                private activatedRoute: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe((params) => {
            this.searchValue = params['value'];
            if (this.searchValue) {
                this.searchAllDocuments(this.searchValue);
            }
        });
    }

    searchAllDocuments(searchKey: string) {
        this.requestsService.getRequest(ApiUrlConstants.DL_DOCUMENT_SEARCH_API_URL
            .replace('{searchKey}', searchKey))
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

    onMenuClicked(data: DlDocumentDTO) {
        this.selectedDoc = data;
    }

    setGridDisplay() {
        this.showGridDisplay = true;
    }

    setListDisplay() {
        this.showGridDisplay = false;
    }

    navigateToRoute(breadcrumb: BreadcrumbDTO) {
        this.router.navigate([breadcrumb.route]);
    }

    navigateToDocLib(id: any) {
        localStorage.setItem(window.btoa(AppConstants.SELECTED_FOLDER_ID), id);
        this.router.navigate(['/doc-lib']);
    }
}
