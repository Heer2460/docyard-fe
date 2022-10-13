import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DocLibComponent} from "./doc-lib.component";

const routes: Routes = [
    {
        path: '',
        component: DocLibComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DocLibRoutingModule {
}
