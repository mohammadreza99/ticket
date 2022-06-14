import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginPage} from "@modules/auth/login/login.page";

const routes: Routes = [
  {
    path: 'login',
    component: LoginPage,
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {
}
