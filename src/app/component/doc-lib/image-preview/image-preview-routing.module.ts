import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ImagePreviewComponent} from "./image-preview.component";

const routes: Routes = [
    {
        path: '',
        component: ImagePreviewComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ImagePreviewRoutingModule {
}
