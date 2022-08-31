import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LayoutComponent} from './layout.component';
import {RouterModule} from "@angular/router";
import {SidebarModule} from "./sidebar/sidebar.module";
import {InfoPaneModule} from "./info-pane/info-pane.module";
import {BannerModule} from "./banner/banner.module";
import {NavModule} from "./nav/nav.module";
import { RightPaneComponent } from './right-pane/right-pane.component';

@NgModule({
    declarations: [
        LayoutComponent,
        RightPaneComponent,
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
