import {Component, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";
import {AppService} from "../../service/app.service";

@Component({
    selector: 'doc-lib-component',
    templateUrl: './doc-lib.template.html',
    styleUrls: ['./doc-lib.component.less']
})
export class DocLibComponent implements OnInit {
    
    menuItems: MenuItem[] = [];
    uploadMenuItems: MenuItem[] = [];
    rows: any[] = [
        {
            id: 1,
            name: 'My pics',
            updatedAt: 'Today',
            user: {
                userId: 1,
                username: 'Umar Farooq'
            },
            size: '33.3 KB',
            stared: false,
            selected: false,
            fileType: 'directory',
            fileThumbnail: 'optional',
            shared: false,
        },
        {
            id: 2,
            name: 'Prototypes',
            updatedAt: 'Jul, 10 2022',
            user: {
                userId: 1,
                username: 'Umar Farooq'
            },
            size: '200.0 KB',
            stared: true,
            selected: false,
            fileType: 'directory',
            fileThumbnail: 'optional',
            shared: true,
        },
        {
            id: 3,
            name: 'Business Requirements.docx',
            updatedAt: '1 minute ago',
            user: {
                userId: 1,
                username: 'Umar Farooq'
            },
            size: '350.0 KB',
            stared: false,
            selected: false,
            fileType: 'docx',
            fileThumbnail: 'optional',
            shared: false,
        },
        {
            id: 4,
            name: 'Object Oriented Programming.pdf',
            updatedAt: 'Jun, 22 2022',
            user: {
                userId: 1,
                username: 'Umar Farooq'
            },
            size: '10.0 MB',
            stared: false,
            selected: false,
            fileType: 'pdf',
            fileThumbnail: 'optional',
            shared: false,
        }
    ];
    docInfoPane: boolean = false;
    
    constructor(public appService: AppService) {
        this.appService.toggleDocInfoPaneSubject.subscribe((value: boolean) => {
            this.docInfoPane = value;
        });
    }
    
    ngOnInit(): void {
        this.buildActions();
        this.buildUploadActions();
    }
    
    buildActions() {
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
    
    buildUploadActions() {
        this.uploadMenuItems = [
            {
                label: 'File',
                icon: 'icon-file-plus',
                command: () => {
                }
            },
            {
                label: 'Folder',
                icon: 'icon-folder-plus',
                command: () => {
                }
            }
        ];
    }
    
}
