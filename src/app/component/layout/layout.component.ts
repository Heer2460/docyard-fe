import {Component, Input, OnInit} from '@angular/core';
import {AppService} from "../../service/app.service";
import {Router} from "@angular/router";

@Component({
    selector: 'layout-component',
    templateUrl: './layout.template.html',
    styleUrls: ['./layout.component.less']
})
export class LayoutComponent implements OnInit {
    
    showMenu: boolean = false;
    showRightPane: boolean = false;
    showDocInfoPane: boolean = true;
    
    @Input() showDisplayButtons: boolean = false;
    
    constructor(public appService: AppService, private router: Router) {
    
    }
    
    ngOnInit(): void {
        this.appService.showMenuBSubject.subscribe((value: boolean) => {
            this.showMenu = value;
        });
        
        this.appService.showRightPaneSubject.subscribe((value: boolean) => {
            this.showRightPane = value;
        });
        
        this.appService.showDocInfoPaneSubject.subscribe((value: boolean) => {
            this.showDocInfoPane = value;
        });
    }
    
}
