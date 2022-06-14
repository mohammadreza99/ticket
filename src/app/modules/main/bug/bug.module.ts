import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BugPage} from './bug.page';
import {SharedModule} from "@shared/shared.module";


@NgModule({
  declarations: [
    BugPage
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BugModule {
}
