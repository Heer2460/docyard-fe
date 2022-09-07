import {Component, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";
import {AppService} from "../../service/app.service";
import {RoutesDTO} from "../../model/routes.dto";

@Component({
    selector: 'dashboard-component',
    templateUrl: './home.template.html',
    styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
    
    items: MenuItem[] = [];
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
        this.items = [
            {
                label: 'Setting 1',
                icon: 'icon-cog',
                command: () => {
                }
            },
            {separator: true},
            {
                label: 'Setting 2',
                icon: 'icon-cog',
                command: () => {
                }
            }
        ];
    }
    
}
