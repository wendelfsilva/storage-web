import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {DocumentComponent} from "./layouts/document/document.component";
import {AuthGuard} from "@core/guards/auth.guard";
import {WellcomeComponent} from "@core/layouts/wellcome/wellcome.component";

const routes: Routes = [
    {
        path: "document", component: DocumentComponent, canActivate: [AuthGuard]
    },
    {
        path: "**", component: WellcomeComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StorageRoutingModule {
}
