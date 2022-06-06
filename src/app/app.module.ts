import {registerLocaleData} from '@angular/common';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import localeEn from "@angular/common/locales/en";
import {CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {LANGUAGE, LANGUAGES, TranslateService} from '@shared/services/translate.service';
import {WebpackTranslateLoader} from '@shared/translates/webpack-translate-loader';
import {NgProgressModule} from 'ngx-progressbar';
import {ToastrModule} from 'ngx-toastr';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {CoreModule} from "@core/core.module";
import {NgxUiLoaderConfig, NgxUiLoaderModule} from "ngx-ui-loader";
import {AuthInterceptor} from "@core/interceptors/auth.interceptor";


registerLocaleData(localeEn, "en-US");


const TRANSLATE_CONFIG = {
    loader: {provide: TranslateLoader, useClass: WebpackTranslateLoader}
};

const PROGRESS_CONFIG = {
    color: "gray"
};

const LOADER_OPTIONS: NgxUiLoaderConfig = {
    bgsColor: "#7D7D7D",
    bgsOpacity: 0.5,
    bgsPosition: "bottom-right",
    bgsSize: 80,
    bgsType: "three-bounce",
    blur: 5,
    fgsColor: "#7D7D7D",
    fgsPosition: "center-center",
    fgsSize: 80,
    fgsType: "three-bounce",
    gap: 24,
    logoPosition: "center-center",
    logoSize: 120,
    logoUrl: "",
    overlayBorderRadius: "0",
    overlayColor: "rgba(40, 40, 40, 0.8)",
    pbColor: "#7D7D7D",
    pbDirection: "ltr",
    pbThickness: 3,
    hasProgressBar: true,
    text: "",
    textColor: "#FFFFFF",
    textPosition: "center-center",
}


@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        FlexLayoutModule,
        HttpClientModule,
        NgProgressModule.withConfig(PROGRESS_CONFIG),
        TranslateModule.forRoot(TRANSLATE_CONFIG),
        NgxUiLoaderModule.forRoot(LOADER_OPTIONS),
        ToastrModule.forRoot(),
        CoreModule,
    ],
    providers: [
        {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
        {provide: LOCALE_ID, deps: [TranslateService], useFactory: (translate: TranslateService) => translate.currentLang},
        {provide: MAT_DATE_LOCALE, deps: [TranslateService], useFactory: (translate: TranslateService) => translate.currentLang},
        {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]},
        {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
    ],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {

    constructor(private _adapter: DateAdapter<any>,
                private _translate: TranslateService) {

        this._adapter.setLocale(LANGUAGE.EN_US);

        this._translate.addLangs(LANGUAGES);
        this._translate.setDefaultLang(LANGUAGE.EN_US);
        this._translate.use(LANGUAGE.EN_US);
    }
}
