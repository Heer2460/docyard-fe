import {Component, OnInit} from '@angular/core';
import {AppService} from "../../../service/app.service";
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'image-preview-component',
    templateUrl: './image-preview.template.html',
    styleUrls: ['./image-preview.component.less']
})
export class ImagePreviewComponent implements OnInit {
    
    selectedItem: any = null;
    
    constructor(public appService: AppService, private activatedRoute: ActivatedRoute) {
        this.selectedItem = activatedRoute.snapshot.paramMap.get('fileUrl');
    }
    
    ngOnInit(): void {
        console.log(this.selectedItem);
    }
    
}
