import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {AppService} from "../../../service/app.service";

@Component({
    selector: 'image-preview-component',
    templateUrl: './image-preview.template.html',
    styleUrls: ['./image-preview.component.less'],
    encapsulation: ViewEncapsulation.None
})
export class ImagePreviewComponent implements OnInit {
    
    docInfoPane: boolean = true;
    
    constructor(public appService: AppService) {
        this.appService.setToggleDocInfoPaneSubject(this.docInfoPane);
    }
    
    ngOnInit(): void {
        this.appService.toggleDocInfoPaneSubject.subscribe((value: boolean) => {
            this.docInfoPane = value;
        });
    }
    
}
