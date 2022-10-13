import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {AppService} from "../../../../service/app.service";
import {MenuItem} from "primeng/api";
import {Router} from "@angular/router";

@Component({
    selector: 'preview-actions-component',
    templateUrl: './preview-actions.template.html',
    styleUrls: ['./preview-actions.component.less'],
})
export class PreviewActionsComponent implements OnInit {
    
    uploadMenuItems: MenuItem[] = [];
    
    constructor(public appService: AppService, private router: Router) {
    
    }
    
    ngOnInit(): void {
        this.buildOptionItems();
    }
    
    buildOptionItems() {
        this.uploadMenuItems = [
            {
                label: 'Option 1',
                icon: 'icon-cog',
                command: () => {
                }
            },
            {
                label: 'Option 2',
                icon: 'icon-cog',
                command: () => {
                }
            }
        ];
    }
    
    backToDocLibAction() {
        this.router.navigate(['/doc-lib']);
    }
    
}
