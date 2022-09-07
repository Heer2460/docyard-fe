import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SettingComponent} from "./setting.component";
import {SettingRoutingModule} from "./setting-routing.module";
import {LayoutModule} from "../layout/layout.module";

@NgModule({
    declarations: [
        SettingComponent
    ],
    imports: [
        CommonModule,
        SettingRoutingModule,
        LayoutModule
    ]
})
export class SettingModule {
}
