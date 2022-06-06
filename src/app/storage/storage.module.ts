import {NgModule} from "@angular/core";
import {SharedModule} from "@shared/shared.module";
import {StorageRoutingModule} from "./storage-routing.module";
import {DocumentComponent} from './layouts/document/document.component';
import {DocumentService} from './services/document.service';

@NgModule({
    declarations: [
        DocumentComponent,
    ],
    imports: [
        StorageRoutingModule,
        SharedModule,
    ],
    providers: [
        DocumentService,
    ]
})
export class StorageModule {
}
