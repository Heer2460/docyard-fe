import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SidebarComponent} from './sidebar.component';
import {SidebarHeaderComponent} from './sidebar-header/sidebar-header.component';
import {RouterModule} from "@angular/router";
import {StorageViewerComponent} from './storage-viewer/storage-viewer.component';
import {BannerModule} from "../banner/banner.module";

@NgModule({
    declarations: [
        SidebarComponent,
        SidebarHeaderComponent,
        StorageViewerComponent
    ],
    exports: [
        SidebarComponent,
        SidebarHeaderComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        BannerModule
    ]
})
export class SidebarModule {
}
