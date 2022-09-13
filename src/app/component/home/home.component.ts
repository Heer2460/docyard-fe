import {Component, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";

@Component({
    selector: 'home-component',
    templateUrl: './home.template.html',
    styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
    
    menuItems: MenuItem[] = [];
    gridItems: any[] = [
        {
            id: 1,
            name: 'tour-pic.jpeg',
            updatedAt: 'Aug 24, 2022',
            user: {
                userId: 1,
                username: 'Umar Farooq'
            },
            size: '333.35 KB',
            stared: false,
            selected: false,
            fileType: 'image',
            fileThumbnail: './assets/images/image.png',
            shared: false,
        },
        {
            id: 2,
            name: 'Curriculum Vitae.docx',
            updatedAt: 'Sep 24, 2022',
            user: {
                userId: 1,
                username: 'Umar Farooq'
            },
            size: '500 KB',
            stared: false,
            selected: false,
            fileType: 'docx',
            fileThumbnail: '',
            shared: false,
        },
        {
            id: 3,
            name: 'Software requirements.pdf',
            updatedAt: 'Sep 24, 2022',
            user: {
                userId: 1,
                username: 'Umar Farooq'
            },
            size: '300 KB',
            stared: false,
            selected: false,
            fileType: 'pdf',
            fileThumbnail: '',
            shared: false,
        },
        {
            id: 4,
            name: 'Family pictures',
            updatedAt: 'Sep 24, 2022',
            user: {
                userId: 1,
                username: 'Umar Farooq'
            },
            size: '300 KB',
            stared: false,
            selected: false,
            fileType: 'directory',
            fileThumbnail: '',
            shared: false,
        },
    ];
    
    constructor() {
    }
    
    ngOnInit(): void {
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
    
}
