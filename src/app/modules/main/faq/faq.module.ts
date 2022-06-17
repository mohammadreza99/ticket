import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FAQPage} from './faq.page';
import {SharedModule} from "@shared/shared.module";


@NgModule({
  declarations: [
    FAQPage
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FAQModule {
}
