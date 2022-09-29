import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MenuItem} from "primeng/api";
import {AppService} from "../../service/app.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AppUtility} from "../../util/app.utility";

@Component({
    selector: 'doc-lib-component',
    templateUrl: './doc-lib.template.html',
    styleUrls: ['./doc-lib.component.less']
})
export class DocLibComponent implements OnInit {

    @ViewChild('fileUpload') fileUpload: ElementRef | undefined;
    @ViewChild('folderUpload') folderUpload: ElementRef | undefined;

    addFolderForm: FormGroup = new FormGroup({});
    addFileForm: FormGroup = new FormGroup({});
    menuItems: MenuItem[] = [];
    uploadMenuItems: MenuItem[] = [];
    createMenuItems: MenuItem[] = [];
    visibleAddFolderDialog: boolean = false;
    visibleAddFileDialog: boolean = false;
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
    
    constructor(public appService: AppService,
                private fb: FormBuilder,
                public appUtility: AppUtility) {
        this.appService.toggleDocInfoPaneSubject.subscribe((value: boolean) => {
            this.docInfoPane = value;
        });
    }
    
    ngOnInit(): void {
        this.buildDocumentActions();
        this.buildOptionItems();
        this.buildForms();
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
                label: 'Folder',
                icon: 'icon-folder-plus',
                command: () => this.showAddFolderPopup()
            },
            {
                label: 'Text File',
                icon: 'icon-file-plus',
                command: () => this.showAddFilePopup()
            }
        ];
        this.uploadMenuItems = [
            {
                label: 'File',
                icon: 'icon-file-plus',
                command: () => this.fileUpload?.nativeElement.click()
            },
            {
                label: 'Folder',
                icon: 'icon-folder-plus',
                command: () => this.folderUpload?.nativeElement.click()
            }
        ];
    }

    buildForms() {
        this.addFolderForm = this.fb.group({
            name: [null, [Validators.required, Validators.maxLength(17)]],
        });
        this.addFileForm = this.fb.group({
            name: [null, [Validators.required, Validators.maxLength(17)]],
        });
    }

    // creating
    showAddFolderPopup() {
        this.addFolderForm.patchValue({
            name: '',
        });
        this.addFolderForm.markAsUntouched();
        this.visibleAddFolderDialog = true;
    }

    hideAddFolderPopup() {
        this.visibleAddFolderDialog = false;
    }

    showAddFilePopup() {
        this.addFileForm.patchValue({
            name: '',
        });
        this.addFileForm.markAsUntouched();
        this.visibleAddFileDialog = true;
    }

    hideAddFilePopup() {
        this.visibleAddFileDialog = false;
    }


    // updating
    uploadFile(event: any) {
        console.log('Single:', event.target.files[0]);
        // if (event.target.files.length > 0) {
        //     this.files.push(event.target.files[0]);
        //     console.log(this.files);
        // }
    }

    uploadFolder(event: any) {
        console.log('Dir: ', event.target.files);

        for (let i = 0; i < event.target.files.length; i++) {
            const file = event.target.files[i];
            const path = file.webkitRelativePath.split('/');
            // upload file using path
            console.log('Path ', i, path);
        }
    }
}
