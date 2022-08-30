import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannerUpgradeComponent } from './banner-upgrade/banner-upgrade.component';



@NgModule({
    declarations: [
        BannerUpgradeComponent
    ],
    exports: [
        BannerUpgradeComponent
    ],
    imports: [
        CommonModule
    ]
})
export class BannerModule { }
