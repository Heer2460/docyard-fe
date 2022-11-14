import {Component, OnInit} from '@angular/core';
import {AppService} from "../../../../service/app.service";

@Component({
    selector: 'storage-viewer-component',
    templateUrl: './storage-viewer.template.html',
    styleUrls: ['./storage-viewer.component.less']
})
export class StorageViewerComponent implements OnInit {

    usedSpace: string = '0 GB';
    usedSpacePercentage: number = 0;

    constructor(private appService: AppService) {
    }

    ngOnInit(): void {
        this.usedSpace = this.appService.userInfo.spaceUsedFormatted ? this.appService.userInfo.spaceUsedFormatted : '0 GB';
        if (this.appService.userInfo.totalUsedSpace && this.appService.userInfo.totalAllottedSize) {
            this.usedSpacePercentage = (this.appService.userInfo.totalUsedSpace / this.appService.userInfo.totalAllottedSize) * 100;
        }
    }

    navigateToWebsite() {
        window.open('https://www.infotechgroup.com/contact-us/');
    }
}
