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
    createMenuItems: MenuItem[] = [];
    visibleAddFolderDialog: boolean = false;
    visibleAddFileDialog: boolean = false;
    visibleUploadFolderDialog: boolean = false;
    visibleUploadFileDialog: boolean = false;
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
    files: any[] = [];
    
    constructor(public appService: AppService) {
        this.appService.toggleDocInfoPaneSubject.subscribe((value: boolean) => {
            this.docInfoPane = value;
        });
    }
    
    ngOnInit(): void {
        this.buildDocumentActions();
        this.buildOptionItems();
    }

    buildDocumentActions() {
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

    buildOptionItems() {
        this.createMenuItems = [
            {
                label: 'File',
                icon: 'icon-file-plus',
                command: () => this.showAddFilePopup()
            },
            {
                label: 'Folder',
                icon: 'icon-folder-plus',
                command: () => this.showAddFolderPopup()
            }

        ];
        this.uploadMenuItems = [
            {
                label: 'File',
                icon: 'icon-file-plus',
                command: () => this.showUploadFilePopup()
            },
            {
                label: 'Folder',
                icon: 'icon-folder-plus',
                command: () => this.showUploadFolderPopup()
            }
        ];
    }

    // creating
    showAddFolderPopup() {
        this.visibleAddFolderDialog = true;
    }

    hideAddFolderPopup() {
        this.visibleAddFolderDialog = false;
    }

    showAddFilePopup() {
        this.visibleAddFileDialog = true;
    }

    hideAddFilePopup() {
        this.visibleAddFileDialog = false;
    }


    // updating

    showUploadFolderPopup() {
        this.visibleUploadFolderDialog = true;
    }

    hideUploadFolderPopup() {
        this.visibleUploadFolderDialog = false;
    }

    showUploadFilePopup() {
        this.visibleUploadFileDialog = true;
    }

    hideUploadFilePopup() {
        this.visibleUploadFileDialog = false;
    }

    setAttachment(event: any) {
        // let format;
        // let size;
        if (event.target.files.length > 0) {
            // size = event.target.files[0].size / 1024 / 1024;
            // if (size > 2) {
            //     this.toastService.error('Uploaded file size is not supported.', 'Logo');
            //     return;
            // }
            // format = event.target.files[0].type;
            // if (!format.includes('image/')) {
            //     this.toastService.error('Uploaded file type is not supported.', 'Logo');
            //     return;
            // }
            // let obj = {
            //     type: 'logo',
            //     data: event.target.files[0]
            // };
            this.files.push(event.target.files[0]);
            console.log(this.files);
        }
    }
}
