import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SidebarHeaderComponent} from "./sidebar-header.component";

@NgModule({
    declarations: [
        SidebarHeaderComponent,
    ],
    exports: [
        SidebarHeaderComponent
    ],
    imports: [
        CommonModule,
    ]
})
export class SidebarHeaderModule {
}
