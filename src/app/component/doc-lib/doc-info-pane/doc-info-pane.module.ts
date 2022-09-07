import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DocInfoPaneComponent} from './doc-info-pane.component';
import {AccordionModule} from "primeng/accordion";

@NgModule({
    declarations: [
        DocInfoPaneComponent
    ],
    exports: [
        DocInfoPaneComponent
    ],
    imports: [
        CommonModule,
        AccordionModule
    ]
})
export class DocInfoPaneModule {
}
