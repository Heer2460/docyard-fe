import {Component, OnInit} from '@angular/core';
import {RoleActionConstants} from "../../util/role.actions.constants";
import {AppService} from "../../service/app.service";

@Component({
    selector: 'setting-component',
    templateUrl: './setting.template.html',
    styleUrls: ['./setting.component.less']
})
export class SettingComponent implements OnInit {

    constructor(public appService: AppService) {
    }

    ngOnInit(): void {
    }
    
    
}
