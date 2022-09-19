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
            fileUrl: 'optional',
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
            fileUrl: 'optional',
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
            fileUrl: 'optional',
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
            fileUrl: 'optional',
            shared: false,
        },
        {
            id: 4,
            name: 'Glas Allt Shie.jpeg',
            updatedAt: 'Jun, 22 2022',
            user: {
                userId: 1,
                username: 'Umar Farooq'
            },
            size: '1.00 MB',
            stared: false,
            selected: false,
            fileType: 'image',
            fileUrl: 'https://images.unsplash.com/photo-1663163541223-2227c0bb696a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
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
