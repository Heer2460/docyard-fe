import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FileUploaderComponent} from './file-uploader.component';
import {DocInfoPaneModule} from "../doc-info-pane/doc-info-pane.module";
import {NavModule} from "../../layout/nav/nav.module";
import {TieredMenuModule} from "primeng/tieredmenu";

@NgModule({
    declarations: [
        FileUploaderComponent
    ],
    exports: [
        FileUploaderComponent
    ],
    imports: [
        CommonModule,
        DocInfoPaneModule,
        NavModule,
        TieredMenuModule,
    ]
})
export class FileUploaderModule {
}
