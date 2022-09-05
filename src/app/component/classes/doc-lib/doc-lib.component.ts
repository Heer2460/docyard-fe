import {Component, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";

@Component({
    selector: 'doc-lib-component',
    templateUrl: '../../templates/doc-lib/doc-lib.template.html',
    styleUrls: ['../../styles/home/home.component.less']
})
export class DocLibComponent implements OnInit {
    
    items: MenuItem[] = [];
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
    
    constructor() {
    }
    
    ngOnInit(): void {
        this.buildActions();
    }
    
    buildActions() {
        this.items = [
            {
                label: 'Share',
                icon: 'icon-cog',
                command: () => {
                }
            },
            {
                label: 'Download',
                icon: 'icon-cog',
                command: () => {
                }
            },
            {
                label: 'Delete',
                icon: 'pi pi-sign-out',
                command: () => {
                }
            },
            {
                label: 'Rename',
                icon: 'pi pi-sign-out',
                command: () => {
                }
            }
        ];
    }
    
}
