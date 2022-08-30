import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SidebarComponent} from './sidebar.component';
import {SidebarHeaderComponent} from './sidebar-header/sidebar-header.component';
import {RouterModule} from "@angular/router";

@NgModule({
    declarations: [
        SidebarComponent,
        SidebarHeaderComponent
    ],
    exports: [
        SidebarComponent,
        SidebarHeaderComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
    ]
})
export class SidebarModule {
}
