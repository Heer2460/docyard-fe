import {Component, Input, OnInit} from '@angular/core';
import {AppService} from "../../service/app.service";
import {Router} from "@angular/router";

@Component({
    selector: 'layout-component',
    templateUrl: './layout.template.html',
    styleUrls: ['./layout.component.less']
})
export class LayoutComponent implements OnInit {
    
    toggleMenuState: boolean = false;
    toggleRightPaneState: boolean = false;
    docInfoPane: boolean = false;
    
    @Input() showDisplayButtons: boolean = false;
    
    constructor(public appService: AppService, private router: Router) {
    
    }
    
    ngOnInit(): void {
        this.appService.toggleMenuBSubject.subscribe((value: boolean) => {
            this.toggleMenuState = value;
        });
        
        this.appService.toggleRightPaneSubject.subscribe((value: boolean) => {
            this.toggleRightPaneState = value;
        });
        
        this.appService.toggleDocInfoPaneSubject.subscribe((value: boolean) => {
            this.docInfoPane = value;
        });
    }
    
}
