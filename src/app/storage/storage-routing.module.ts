import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {DocumentComponent} from "./layouts/document/document.component";
import {AuthGuard} from "@core/guards/auth.guard";

const routes: Routes = [
    {path: "document", component: DocumentComponent, canActivate: [AuthGuard]},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StorageRoutingModule {
}
