import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from './nav.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import {TieredMenuModule} from "primeng/tieredmenu";
import { SearchBarComponent } from './search-bar/search-bar.component';
import { NotificationComponent } from './notification/notification.component';



@NgModule({
    declarations: [
        NavComponent,
        UserProfileComponent,
        SearchBarComponent,
        NotificationComponent
    ],
    exports: [
        NavComponent,
        UserProfileComponent
    ],
    imports: [
        CommonModule,
        TieredMenuModule
    ]
})
export class NavModule { }
