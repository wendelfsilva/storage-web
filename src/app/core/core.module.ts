import {NgModule} from '@angular/core';
import {HomeComponent} from './layouts/home/home.component';
import {LoginComponent} from './layouts/login/login.component';
import {AuthService} from './services/auth.service';
import {SharedModule} from "@shared/shared.module";

@NgModule({
    declarations: [
        HomeComponent,
        LoginComponent,
    ],
    imports: [
        SharedModule,
    ],
    providers: [
        AuthService,
    ],
    bootstrap: [HomeComponent]
})
export class CoreModule {
}
