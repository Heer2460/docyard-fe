import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SidebarHeaderComponent} from "./sidebar-header.component";
import {RouterLink} from "@angular/router";

@NgModule({
    declarations: [
        SidebarHeaderComponent,
    ],
    exports: [
        SidebarHeaderComponent
    ],
    imports: [
        CommonModule,
        RouterLink,
    ]
})
export class SidebarHeaderModule {
}
