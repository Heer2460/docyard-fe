import {Component, OnInit} from '@angular/core';
import {AppService} from "../../../service/app.service";

@Component({
    selector: 'doc-info-pane-component',
    templateUrl: './doc-info-pane.template.html',
    styleUrls: ['./doc-info-pane.component.less']
})
export class DocInfoPaneComponent implements OnInit {
    
    docInfoPane: boolean = false;
    toggleShowAll: boolean = false;
    constructor(public appService: AppService) {
        this.appService.toggleDocInfoPaneSubject.subscribe((value: boolean) => {
            this.docInfoPane = value;
        });
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
