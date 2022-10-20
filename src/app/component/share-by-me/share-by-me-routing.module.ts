import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ShareByMeComponent} from "./share-by-me.component";

const routes: Routes = [
    {
        path: '',
        component: ShareByMeComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ShareByMeRoutingModule {
}
