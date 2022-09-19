import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DocLibComponent} from "./doc-lib.component";

const routes: Routes = [
    {
        path: '',
        component: DocLibComponent
    },
    {
        path: 'preview',
        children: [
            {
                path: '',
                loadChildren: () => import('./image-preview/image-preview.module').then(m => m.ImagePreviewModule)
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DocLibRoutingModule {
}
