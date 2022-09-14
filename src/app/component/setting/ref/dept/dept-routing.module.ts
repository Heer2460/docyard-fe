import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DeptComponent} from "./dept.component";

const routes: Routes = [
    {
        path: '',
        component: DeptComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DeptRoutingModule {
}
