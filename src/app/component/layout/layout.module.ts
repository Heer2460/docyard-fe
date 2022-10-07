import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LayoutComponent} from './layout.component';
import {RouterModule} from "@angular/router";
import {SidebarModule} from "./sidebar/sidebar.module";
import {BannerModule} from "./banner/banner.module";
import {NavModule} from "./nav/nav.module";
import {RightPaneComponent} from './right-pane/right-pane.component';
import {MenuModule} from "primeng/menu";
import {DocInfoPaneModule} from "../doc-lib/doc-info-pane/doc-info-pane.module";

@NgModule({
    declarations: [
        LayoutComponent,
        RightPaneComponent,
    ],
    exports: [
        LayoutComponent,
        RightPaneComponent
    ],
    imports: [
        NavModule,
        BannerModule,
        SidebarModule,
        CommonModule,
        RouterModule,
        MenuModule,
        DocInfoPaneModule,
    ]
})
export class LayoutModule {
}
