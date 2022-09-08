import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DeptComponent} from "./dept.component";

const routes: Routes = [
    {
        path: '',
        component: DeptComponent
    },
    {
        path: 'add',
        children: [
            {
                path: '',
                loadChildren: () => import('./add-dept/add-dept.module').then(m => m.AddDeptModule)
            }
        ]
    },
    {
        path: 'edit',
        children: [
            {
                path: '',
                loadChildren: () => import('./edit-dept/edit-dept.module').then(m => m.EditDeptModule)
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DeptRoutingModule {
}
