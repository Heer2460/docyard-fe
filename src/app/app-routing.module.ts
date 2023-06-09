import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PageNotFoundComponent} from "./component/page-not-found/page-not-found.component";
import {AuthGuard} from "./guard/auth.guard";
import {LayoutComponent} from "./component/layout/layout.component";
import {ResetPasswordComponent} from "./component/reset-password/reset-password.component";

const routes: Routes = [
    {path: 'reset-password', component: ResetPasswordComponent},
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
        path: 'shared-by-me',
        component: LayoutComponent,
        children: [
            {
                path: '',
                loadChildren: () => import('./component/share-by-me/share-by-me.module').then(m => m.ShareByMeModule)
            }
        ]
    },
    {
        path: 'shared-with-me',
        component: LayoutComponent,
        children: [
            {
                path: '',
                loadChildren: () => import('./component/share-with-me/share-with-me.module').then(m => m.ShareWithMeModule)
            }
        ]
    },
    {
        path: 'archived',
        component: LayoutComponent,
        children: [
            {
                path: '',
                loadChildren: () => import('./component/archived/archived.module').then(m => m.ArchivedModule)
            }
        ]
    },
    {
        path: 'preview',
        children: [
            {
                path: '',
                loadChildren: () => import('./component/doc-lib/preview/preview.module').then(m => m.PreviewModule)
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
        path: 'trash',
        component: LayoutComponent,
        children: [
            {
                path: '',
                loadChildren: () => import('./component/trash/trash.module').then(m => m.TrashModule)
            }
        ]
    },
    {
        path: 'search',
        component: LayoutComponent,
        children: [
            {
                path: '',
                loadChildren: () => import('./component/search/search.module').then(m => m.SearchModule)
            }
        ]
    },
    {
        path: 'share',
        children: [
            {
                path: '',
                loadChildren: () => import('./component/share/share.module').then(m => m.ShareModule)
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
