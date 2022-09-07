import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from './nav.component';
import {TieredMenuModule} from "primeng/tieredmenu";
import { SearchBarComponent } from './search-bar/search-bar.component';
import { NotificationComponent } from './notification/notification.component';
import {DialogModule} from "primeng/dialog";
import {AppSettingComponent} from "./app-setting/app-setting.component";



@NgModule({
    declarations: [
        NavComponent,
        AppSettingComponent,
        SearchBarComponent,
        NotificationComponent
    ],
    exports: [
        NavComponent,
        AppSettingComponent
    ],
    imports: [
        CommonModule,
        TieredMenuModule,
        DialogModule
    ]
})
export class NavModule { }
