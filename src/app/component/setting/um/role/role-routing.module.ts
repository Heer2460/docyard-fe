import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RoleComponent} from "./role.component";

const routes: Routes = [
    {
        path: '',
        component: RoleComponent
    },
    {
        path: 'add',
        children: [
            {
                path: '',
                loadChildren: () => import('./add-role/add-role.module').then(m => m.AddRoleModule)
            }
        ]
    },
    {
        path: 'edit',
        children: [
            {
                path: '',
                loadChildren: () => import('./edit-role/edit-role.module').then(m => m.EditRoleModule)
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RoleRoutingModule {
}
