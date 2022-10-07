import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SettingComponent} from "./setting.component";
import {SettingRoutingModule} from "./setting-routing.module";
import {LayoutModule} from "../layout/layout.module";
import {BreadcrumbModule} from "../layout/breadcrumb/breadcrumb.module";

@NgModule({
    declarations: [
        SettingComponent
    ],
    imports: [
        CommonModule,
        SettingRoutingModule,
        LayoutModule,
        BreadcrumbModule
    ]
})
export class SettingModule {
}
