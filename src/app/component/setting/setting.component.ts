import {Component, OnInit} from '@angular/core';
import {RoleActionConstants} from "../../util/role.actions.constants";

@Component({
    selector: 'setting-component',
    templateUrl: './setting.template.html',
    styleUrls: ['./setting.component.less']
})
export class SettingComponent implements OnInit {

    roleActions = RoleActionConstants;
    
    ngOnInit(): void {
    }
    
    
}
