import {Component, OnInit} from '@angular/core';
import {AppService} from "../../../../service/app.service";

@Component({
    selector: 'storage-viewer-component',
    templateUrl: './storage-viewer.template.html',
    styleUrls: ['./storage-viewer.component.less']
})
export class StorageViewerComponent implements OnInit {

    usedSpace: string = '0 GB';

    constructor(private appService: AppService) {
    }

    ngOnInit(): void {
        this.usedSpace = this.appService.userInfo.spaceUsed;
    }

    navigateToWebsite() {
        window.open('https://www.infotechgroup.com/contact-us/');
    }
}
