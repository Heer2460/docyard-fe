import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SbmDocInfoPaneComponent} from './sbm-doc-info-pane.component';
import {AccordionModule} from "primeng/accordion";
import {ReactiveFormsModule} from "@angular/forms";
import {TieredMenuModule} from "primeng/tieredmenu";
import {CustomDirectiveModule} from "../../../shared/directive/custom.directive.module";

@NgModule({
    declarations: [
        SbmDocInfoPaneComponent
    ],
    exports: [
        SbmDocInfoPaneComponent
    ],
    imports: [
        CommonModule,
        AccordionModule,
        ReactiveFormsModule,
        TieredMenuModule,
        CustomDirectiveModule
    ]
})
export class SbmDocInfoPaneModule {
}
