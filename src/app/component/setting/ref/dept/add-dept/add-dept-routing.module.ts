import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AddDeptComponent} from "./add-dept.component";

const routes: Routes = [
    {
        path: '',
        component: AddDeptComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AddDeptRoutingModule {
}
