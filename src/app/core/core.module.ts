import {NgModule} from '@angular/core';
import {HomeComponent} from './layouts/home/home.component';
import {LoginComponent} from './layouts/login/login.component';
import {AuthService} from './services/auth.service';
import {SharedModule} from "@shared/shared.module";
import {WellcomeComponent} from "@core/layouts/wellcome/wellcome.component";

@NgModule({
    declarations: [
        LoginComponent,
        HomeComponent,
        WellcomeComponent
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
