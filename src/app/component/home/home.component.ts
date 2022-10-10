import {Component, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";
import {ApiUrlConstants} from "../../util/api.url.constants";
import {HttpResponse} from "@angular/common/http";
import {RequestService} from "../../service/request.service";
import {AppService} from "../../service/app.service";
import {AppConstants} from "../../util/app.constants";

@Component({
    selector: 'home-component',
    templateUrl: './home.template.html',
    styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
    userInfo: any;

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
    recentDocs: any[] = [];
    validExtensions: string[] = AppConstants.VALID_EXTENSIONS;

    constructor(private requestsService: RequestService,
                private appService: AppService) {
        let userData: any = localStorage.getItem(window.btoa(AppConstants.AUTH_USER_INFO));
        this.userInfo = JSON.parse(userData);
    }

    ngOnInit(): void {
        this.getRecentDocument();
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

}
