import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FolderViewRoutingModule } from './folder-view-routing.module';
import { FolderViewComponent } from './folder-view.component';
import {DocInfoPaneModule} from "../../doc-lib/doc-info-pane/doc-info-pane.module";
import {NavModule} from "../../layout/nav/nav.module";
import {TieredMenuModule} from "primeng/tieredmenu";
import {TableModule} from "primeng/table";
import {SidebarHeaderModule} from "../../layout/sidebar/sidebar-header/sidebar-header.module";


@NgModule({
  declarations: [
    FolderViewComponent
  ],
    imports: [
        CommonModule,
        FolderViewRoutingModule,
        DocInfoPaneModule,
        NavModule,
        TieredMenuModule,
        TableModule,
        SidebarHeaderModule
    ]
})
export class FolderViewModule { }
