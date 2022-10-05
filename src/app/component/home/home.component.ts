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
            updatedOn: 'Aug 24, 2022',
            updatedBy: 'Umar Farooq',
            size: '333.35 KB',
            icon: './assets/images/image.png',
        },
        {
            id: 2,
            name: 'Curriculum Vitae.docx',
            updatedOn: 'Aug 24, 2022',
            updatedBy: 'Umar Farooq',
            size: '500 KB',
            icon: './assets/images/svg/docx.svg',
        },
        {
            id: 3,
            name: 'Software requirements.pdf',
            updatedOn: 'Aug 24, 2022',
            updatedBy: 'Umar Farooq',
            size: '300 KB',
            fileThumbnail: './assets/images/svg/pdf.svg',
        },
        {
            id: 3,
            name: 'Software requirements.pdf',
            updatedOn: 'Aug 24, 2022',
            updatedBy: 'Umar Farooq',
            size: '300 KB',
            fileThumbnail: './assets/images/svg/pdf.svg',
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
