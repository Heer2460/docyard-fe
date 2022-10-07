import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PageNotFoundComponent} from "./component/page-not-found/page-not-found.component";
import {AuthGuard} from "./guard/auth.guard";
import {LayoutComponent} from "./component/layout/layout.component";

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                loadChildren: () => import('./component/auth/auth.module').then(m => m.AuthModule)
            }
        ]
    },
    {
        path: 'home',
        component: LayoutComponent,
        children: [
            {
                path: '',
                loadChildren: () => import('./component/home/home.module').then(m => m.HomeModule)
            }
        ]
    },
    {
        path: 'doc-lib',
        component: LayoutComponent,
        children: [
            {
                path: '',
                loadChildren: () => import('./component/doc-lib/doc-lib.module').then(m => m.DocLibModule)
            }
        ]
    },
    {
        path: 'favourite',
        component: LayoutComponent,
        children: [
            {
                path: '',
                loadChildren: () => import('./component/favourite/favourite.module').then(m => m.FavouriteModule)
            }
        ]
    },
    {
        path: 'setting',
        component: LayoutComponent,
        children: [
            {
                path: '', canActivate: [AuthGuard],
                loadChildren: () => import('./component/setting/setting.module').then(m => m.SettingModule)
            }
        ]
    },
    {
        path: 'profile',
        component: LayoutComponent,
        children: [
            {
                path: '',
                loadChildren: () => import('./component/user-profile/user-profile.module').then(m => m.UserProfileModule)
            }
        ]
    },
    {
        path: '**',
        component: PageNotFoundComponent
    },

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
