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
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserRoutingModule {
}
