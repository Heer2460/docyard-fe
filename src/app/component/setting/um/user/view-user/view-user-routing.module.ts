import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ViewUserComponent} from "./view-user.component";

const routes: Routes = [
    {
        path: ':id',
        component: ViewUserComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ViewUserRoutingModule {
}
