import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OperatorPage } from './operator.page';
import { SharedModule } from '@shared/shared.module';



@NgModule({
  declarations: [
    OperatorPage
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class OperatorModule { }
