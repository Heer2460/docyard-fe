import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FolderViewComponent} from "./folder-view.component";

const routes: Routes = [
    {
        path: '',
        component: FolderViewComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FolderViewRoutingModule {
}
