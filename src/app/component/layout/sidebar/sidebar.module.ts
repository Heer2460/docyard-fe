import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SidebarComponent} from './sidebar.component';
import {RouterModule} from "@angular/router";
import {StorageViewerComponent} from './storage-viewer/storage-viewer.component';
import {BannerModule} from "../banner/banner.module";
import {SidebarHeaderModule} from "./sidebar-header/sidebar-header.module";

@NgModule({
    declarations: [
        SidebarComponent,
        StorageViewerComponent
    ],
    exports: [
        SidebarComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
        BannerModule,
        SidebarHeaderModule
    ]
})
export class SidebarModule {
}
