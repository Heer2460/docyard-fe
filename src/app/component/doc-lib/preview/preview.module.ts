import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PreviewComponent} from './preview.component';
import {PreviewRoutingModule} from "./preview-routing.module";
import {DocInfoPaneModule} from "../doc-info-pane/doc-info-pane.module";
import {NavModule} from "../../layout/nav/nav.module";
import {PreviewActionsComponent} from "./preview-actions/preview-actions.component";
import {TieredMenuModule} from "primeng/tieredmenu";

@NgModule({
    declarations: [
        PreviewComponent,
        PreviewActionsComponent
    ],
    imports: [
        CommonModule,
        PreviewRoutingModule,
        DocInfoPaneModule,
        NavModule,
        TieredMenuModule,
    ],
    exports: [
        PreviewActionsComponent
    ]
})
export class PreviewModule {
}
