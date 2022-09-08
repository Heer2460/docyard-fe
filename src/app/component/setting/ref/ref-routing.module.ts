import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RefComponent} from "./ref.component";

const routes: Routes = [
    {
        path: '',
        component: RefComponent
    },
    {
        path: 'dept',
        children: [
            {
                path: '',
                loadChildren: () => import('./dept/dept.module').then(m => m.DeptModule)
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RefRoutingModule {
}
