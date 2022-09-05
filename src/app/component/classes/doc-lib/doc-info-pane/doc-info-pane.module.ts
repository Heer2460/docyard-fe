import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DocInfoPaneComponent} from './doc-info-pane.component';

@NgModule({
    declarations: [
        DocInfoPaneComponent
    ],
    exports: [
        DocInfoPaneComponent
    ],
    imports: [
        CommonModule
    ]
})
export class DocInfoPaneModule {
}
