import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
    {
        path: '',
        pathMatch: "full",
        redirectTo: 'login'
    },
    {
        path: 'login',
        children: [
            {
                path: '',
                loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
            }
        ]
    },
    {
        path: '',
        children: [
            {
                path: '',
                loadChildren: () => import('./forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule)
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule {
}
