import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LayoutComponent} from './layout.component';
import {RouterModule} from "@angular/router";
import {SidebarModule} from "./sidebar/sidebar.module";
import {InfoPaneModule} from "./info-pane/info-pane.module";
import {BannerModule} from "./banner/banner.module";
import {NavModule} from "./nav/nav.module";

@NgModule({
    declarations: [
        LayoutComponent,
    ],
    imports: [
        NavModule,
        BannerModule,
        SidebarModule,
        InfoPaneModule,

        CommonModule,
        RouterModule,
    ]
})
export class LayoutModule {
}
