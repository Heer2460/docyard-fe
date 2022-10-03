import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ImagePreviewComponent} from './image-preview.component';
import {ImagePreviewRoutingModule} from "./image-preview-routing.module";
import {DocInfoPaneModule} from "../doc-info-pane/doc-info-pane.module";
import {NavModule} from "../../layout/nav/nav.module";
import {ImagePreviewActionsComponent} from "./image-preview-actions/image-preview-actions.component";
import {TieredMenuModule} from "primeng/tieredmenu";

@NgModule({
    declarations: [
        ImagePreviewComponent,
        ImagePreviewActionsComponent
    ],
    imports: [
        CommonModule,
        ImagePreviewRoutingModule,
        DocInfoPaneModule,
        NavModule,
        TieredMenuModule,
    ],
    exports: [
        ImagePreviewActionsComponent
    ]
})
export class ImagePreviewModule {
}
