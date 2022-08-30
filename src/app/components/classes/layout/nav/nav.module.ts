import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from './nav.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import {TieredMenuModule} from "primeng/tieredmenu";



@NgModule({
    declarations: [
        NavComponent,
        UserProfileComponent
    ],
    exports: [
        NavComponent
    ],
    imports: [
        CommonModule,
        TieredMenuModule
    ]
})
export class NavModule { }
