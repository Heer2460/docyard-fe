import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LayoutComponent} from './layout.component';
import {RouterModule} from "@angular/router";
import {SidebarModule} from "./sidebar/sidebar.module";
import {InfoPaneModule} from "./info-pane/info-pane.module";
import {BannerModule} from "./banner/banner.module";
import {NavModule} from "./nav/nav.module";
import { RightPaneComponent } from './right-pane/right-pane.component';
import {MenuModule} from "primeng/menu";
import {BreadcrumbModule} from "./breadcrumb/breadcrumb.module";

@NgModule({
    declarations: [
        LayoutComponent,
        RightPaneComponent,
    ],
    exports: [
        LayoutComponent
    ],
    imports: [
        NavModule,
        BannerModule,
        SidebarModule,
        InfoPaneModule,
        
        CommonModule,
        RouterModule,
        MenuModule,
        BreadcrumbModule,
    ]
})
export class LayoutModule {
}
