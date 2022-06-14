import {Type} from '@angular/core';
import {FAQModule} from './faq/faq.module';
import {OperatorModule} from './operator/operator.module';
import {TicketModule} from './ticket/ticket.module';
import {BugModule} from "@modules/main/bug/bug.module";
import {DefaultAnswerModule} from "@modules/main/default-answer/default-answer.module";
import {FAQCategoryModule} from "@modules/main/faq-category/faq-category.module";

export const MODULES: Type<any>[] = [
  BugModule,
  DefaultAnswerModule,
  FAQModule,
  FAQCategoryModule,
  OperatorModule,
  TicketModule,
];
