import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DocInfoPaneComponent} from './doc-info-pane.component';
import {AccordionModule} from "primeng/accordion";
import {ReactiveFormsModule} from "@angular/forms";
import {TieredMenuModule} from "primeng/tieredmenu";

@NgModule({
    declarations: [
        DocInfoPaneComponent
    ],
    exports: [
        DocInfoPaneComponent
    ],
    imports: [
        CommonModule,
        AccordionModule,
        ReactiveFormsModule,
        TieredMenuModule
    ]
})
export class DocInfoPaneModule {
}
