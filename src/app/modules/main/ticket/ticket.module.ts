import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TicketPage} from './ticket.page';
import {SharedModule} from "@shared/shared.module";
import { ConversationComponent } from './conversation/conversation.component';


@NgModule({
  declarations: [
    TicketPage,
    ConversationComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TicketModule {
}
