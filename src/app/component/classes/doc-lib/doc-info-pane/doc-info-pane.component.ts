import {Component, OnInit} from '@angular/core';
import {AppService} from "../../../../service/app.service";

@Component({
    selector: 'doc-info-pane-component',
    templateUrl: '../../../templates/doc-lib/doc-info-pane/doc-info-pane.template.html',
    styleUrls: ['../../../styles/doc-lib/doc-info-pane/doc-info-pane.component.less']
})
export class DocInfoPaneComponent implements OnInit {
    
    docInfoPane: boolean = false;
    toggleShowAll: boolean = false;
    constructor(public appService: AppService) {
    }
    
    ngOnInit(): void {
    }
    
    toggleDocInfoPane() {
        this.docInfoPane = !this.docInfoPane;
        this.appService.setToggleDocInfoPaneSubject(this.docInfoPane);
    }
    
    toggleShowAllAction() {
        this.toggleShowAll = !this.toggleShowAll;
    }
    
}
