import {NgModule} from '@angular/core';
import {AuthRoutingModule} from '@modules/auth/auth-routing.module';
import {SharedModule} from '@shared/shared.module';
import {LoginPage} from "@modules/auth/login/login.page";

@NgModule({
  declarations: [LoginPage],
  imports: [AuthRoutingModule, SharedModule],
})
export class AuthModule {
}
