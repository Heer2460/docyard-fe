import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ImagePreviewComponent} from './image-preview.component';
import {ImagePreviewRoutingModule} from "./image-preview-routing.module";
import {DocInfoPaneModule} from "../doc-info-pane/doc-info-pane.module";
import {NavModule} from "../../layout/nav/nav.module";

@NgModule({
    declarations: [
        ImagePreviewComponent
    ],
    imports: [
        CommonModule,
        ImagePreviewRoutingModule,
        DocInfoPaneModule,
        NavModule
    ]
})
export class ImagePreviewModule {
}
