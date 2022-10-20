import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'document-view',
                loadChildren: () => import('./document-view/document-view.module').then(m => m.DocumentViewModule)
            },
            {
                path: 'folder',
                loadChildren: () => import('./folder-view/folder-view.module').then(m => m.FolderViewModule)
            }
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ShareRoutingModule {
}
