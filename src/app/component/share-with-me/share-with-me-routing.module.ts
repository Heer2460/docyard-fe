import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ShareWithMeComponent} from "./share-with-me.component";

const routes: Routes = [
    {
        path: '',
        component: ShareWithMeComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ShareWithMeRoutingModule {
}
