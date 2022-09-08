import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {RouterModule} from "@angular/router";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {ToastrModule} from "ngx-toastr";
import {AppUtility} from "./util/app.utility";
import {
    NgxUiLoaderConfig, NgxUiLoaderHttpModule,
    NgxUiLoaderModule,
    NgxUiLoaderRouterModule,
    PB_DIRECTION,
    POSITION,
    SPINNER
} from "ngx-ui-loader";

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
    fgsSize: 100,
    fgsColor: '#67A352',
    fgsType: "ball-scale-multiple",
    overlayColor: 'rgba(80, 127, 148, 30%)',
    pbColor: '#ee0f0f',
    pbDirection: PB_DIRECTION.leftToRight, // progress bar direction
    pbThickness: 5, // progress bar thickness
};

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        RouterModule,
        BrowserModule,
        CommonModule,
        AppRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot({
            timeOut: 5000,
            closeButton: true
        }),
        NgxUiLoaderModule,
        NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
        NgxUiLoaderRouterModule,
        NgxUiLoaderHttpModule
    ],
    providers: [
        AppUtility
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
