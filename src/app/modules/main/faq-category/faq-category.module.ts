import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FAQCategoryPage} from './faq-category.page';
import {SharedModule} from "@shared/shared.module";


@NgModule({
  declarations: [
    FAQCategoryPage
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FAQCategoryModule {
}
