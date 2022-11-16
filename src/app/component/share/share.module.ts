import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ShareRoutingModule} from './share-routing.module';
import {DocumentViewModule} from "./document-view/document-view.module";
import {FolderViewModule} from "./folder-view/folder-view.module";

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        ShareRoutingModule,
        DocumentViewModule,
        FolderViewModule
    ]
})
export class ShareModule {
}
