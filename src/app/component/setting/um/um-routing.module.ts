import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UmComponent} from "./um.component";

const routes: Routes = [
    {
        path: '',
        component: UmComponent
    },
    {
        path: 'user',
        children: [
            {
                path: '',
                loadChildren: () => import('./user/user.module').then(m => m.UserModule)
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UmRoutingModule {
}
