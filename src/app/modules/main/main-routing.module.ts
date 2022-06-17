import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {MainPage} from './main.page';
import {OperatorPage} from './operator/operator.page';
import {FAQPage} from './faq/faq.page';
import {TicketPage} from './ticket/ticket.page';
import {BugPage} from '@modules/main/bug/bug.page';
import {DefaultAnswerPage} from '@modules/main/default-answer/default-answer.page';
import {FAQCategoryPage} from '@modules/main/faq-category/faq-category.page';

const routes: Routes = [
  {
    path: '',
    component: MainPage,
    children: [
      {
        path: 'bug',
        component: BugPage,
      },
      {
        path: 'default-answer',
        component: DefaultAnswerPage,
      },
      {
        path: 'faq',
        component: FAQPage,
      },
      {
        path: 'faq-category',
        component: FAQCategoryPage,
      },
      {
        path: 'operator',
        component: OperatorPage,
      },
      {
        path: 'ticket',
        component: TicketPage,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {
}
