import {Component, OnInit} from '@angular/core';
import {AppService} from "../../../service/app.service";

@Component({
    selector: 'image-preview-component',
    templateUrl: './image-preview.template.html',
    styleUrls: ['./image-preview.component.less'],
})
export class ImagePreviewComponent implements OnInit {
    
    docInfoPane: boolean = true;
    defaultZoom: number = 0;
    magnifierZoom: number = this.defaultZoom;
    imageObj: any = null;
    initialWidth: number = 0;
    initialHeight: number = 0;
    stared: boolean = false;
    
    constructor(public appService: AppService) {
        this.appService.setDocInfoPaneSubjectState(this.docInfoPane);
    }
    
    ngOnInit(): void {
        this.appService.showDocInfoPaneSubject.subscribe((value: boolean) => {
            this.docInfoPane = value;
        });
        this.setInitialProps();
    }
    
    magnifierZoomInAction() {
        this.magnifierZoom += 10;
        this.generateStyleObj();
    }
    
    magnifierZoomOutAction() {
        this.magnifierZoom -= 10;
        this.generateStyleObj();
    }
    
    setInitialProps() {
        this.imageObj = document.querySelector('.image-container img');
        this.initialWidth = this.imageObj.clientWidth;
        this.initialHeight = this.imageObj.clientHeight;
    }
    
    generateStyleObj() {
        
        const calcWidth = ((this.initialWidth * this.magnifierZoom) / 100) + this.initialWidth;
        const calcHeight = ((this.initialHeight * this.magnifierZoom) / 100) + this.initialHeight;
        
        this.imageObj.style.width = `${calcWidth}px`;
        this.imageObj.style.height = `${calcHeight}px`;
        
    }
    
    starFileAction() {
        this.stared = !this.stared;
    }
    
}
