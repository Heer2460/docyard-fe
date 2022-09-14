import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserComponent} from "./user.component";

const routes: Routes = [
    {
        path: '',
        component: UserComponent
    },
    {
        path: 'add',
        children: [
            {
                path: '',
                loadChildren: () => import('./add-user/add-user.module').then(m => m.AddUserModule)
            }
        ]
    },
    {
        path: 'edit',
        children: [
            {
                path: '',
                loadChildren: () => import('./edit-user/edit-user.module').then(m => m.EditUserModule)
            }
        ]
    },
    {
        path: 'view',
        children: [
            {
                path: '',
                loadChildren: () => import('./view-user/view-user.module').then(m => m.ViewUserModule)
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserRoutingModule {
}
