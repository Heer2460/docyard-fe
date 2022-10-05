import {Component, OnInit} from '@angular/core';
import {AppService} from "../../../service/app.service";

@Component({
    selector: 'file-uploader-component',
    templateUrl: './file-uploader.template.html',
    styleUrls: ['./file-uploader.component.less'],
})
export class FileUploaderComponent implements OnInit {
    
    showFileUploader: boolean = true;
    
    constructor(public appService: AppService) {
    }
    
    ngOnInit(): void {
    }
    
    toggleFileUploaderAction() {
        this.showFileUploader = !this.showFileUploader;
    }
    
}
