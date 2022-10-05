import {Component, OnInit} from '@angular/core';
import {AppService} from "../../../service/app.service";

@Component({
    selector: 'doc-info-pane-component',
    templateUrl: './doc-info-pane.template.html',
    styleUrls: ['./doc-info-pane.component.less']
})
export class DocInfoPaneComponent implements OnInit {
    
    showDocInfoPane: boolean = true;
    showAll: boolean = false;
    constructor(public appService: AppService) {
        this.appService.showDocInfoPaneSubject.subscribe((value: boolean) => {
            this.showDocInfoPane = value;
        });
    }
    
    ngOnInit(): void {
    }
    
    toggleDocInfoPane() {
        this.appService.setDocInfoPaneSubjectState(!this.showDocInfoPane);
    }
    
    toggleShowAllAction() {
        this.showAll = !this.showAll;
    }
    
}
