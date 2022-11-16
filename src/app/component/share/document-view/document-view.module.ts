import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DocumentViewRoutingModule} from './document-view-routing.module';
import {DocumentViewComponent} from './document-view.component';
import {DocInfoPaneModule} from "../../doc-lib/doc-info-pane/doc-info-pane.module";
import {NavModule} from "../../layout/nav/nav.module";
import {SidebarHeaderModule} from "../../layout/sidebar/sidebar-header/sidebar-header.module";


@NgModule({
    declarations: [
        DocumentViewComponent
    ],
    imports: [
        CommonModule,
        DocumentViewRoutingModule,
        DocInfoPaneModule,
        NavModule,
        SidebarHeaderModule
    ]
})
export class DocumentViewModule {
}
