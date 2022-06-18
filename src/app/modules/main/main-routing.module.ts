import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { MainPage } from './main.page';
import { OperatorPage } from './operator/operator.page';
import { FAQPage } from './faq/faq.page';
import { TicketPage } from './ticket/ticket.page';
import { BugPage } from '@modules/main/bug/bug.page';
import { DefaultAnswerPage } from '@modules/main/default-answer/default-answer.page';
import { FAQCategoryPage } from '@modules/main/faq-category/faq-category.page';

const routes: Routes = [
  {
    path: '',
    component: MainPage,
    children: [
      {
        path: 'bug',
        component: BugPage,
        data: { title: 'bug' }
      },
      {
        path: 'default-answer',
        component: DefaultAnswerPage,
        data: { title: 'default-answer' }
      },
      {
        path: 'faq',
        component: FAQPage,
        data: { title: 'faq' }
      },
      {
        path: 'faq-category',
        component: FAQCategoryPage,
        data: { title: 'faq-category' }
      },
      {
        path: 'operator',
        component: OperatorPage,
        data: { title: 'operator' }
      },
      {
        path: 'ticket',
        component: TicketPage,
        data: { title: 'ticket' }
      },
      {
        path: '',
        redirectTo: 'bug'
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {
}
