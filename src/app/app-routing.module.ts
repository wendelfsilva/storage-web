import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./core/layouts/login/login.component";
import {AuthGuard} from "./core/guards/auth.guard";
import {HomeComponent} from "./core/layouts/home/home.component";

const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: '',
        component: HomeComponent,
        children: [
            {
                path: '',
                loadChildren: () => import('./storage/storage.module').then(m => m.StorageModule),
                canActivate: [AuthGuard]
            }
        ]
    },
    {
        path: "**", component: HomeComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
