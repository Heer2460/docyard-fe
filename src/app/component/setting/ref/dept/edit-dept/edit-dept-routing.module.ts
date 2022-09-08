import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EditDeptComponent} from "./edit-dept.component";

const routes: Routes = [
    {
        path: '',
        component: EditDeptComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EditDeptRoutingModule {
}
