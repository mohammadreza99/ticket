import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from "@shared/shared.module";
import {DefaultAnswerPage} from "@modules/main/default-answer/default-answer.page";


@NgModule({
  declarations: [
    DefaultAnswerPage
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DefaultAnswerModule {
}
