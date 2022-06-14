import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TicketPage} from './ticket.page';
import {SharedModule} from "@shared/shared.module";


@NgModule({
  declarations: [
    TicketPage
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TicketModule {
}
