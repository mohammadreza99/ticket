import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { MainRoutingModule } from './main-routing.module';
import { MainPage } from './main.page';
import { MODULES } from '.';

@NgModule({
  imports: [...MODULES, MainRoutingModule, SharedModule],
  declarations: [MainPage],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class MainModule { }
