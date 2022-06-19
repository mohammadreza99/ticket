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
        path: 'operator',
        component: OperatorPage,
        data: { title: 'اپراتور های سیستم' }
      },
      {
        path: 'bug',
        component: BugPage,
        data: { title: 'باگ' }
      },
      {
        path: 'default-answer',
        component: DefaultAnswerPage,
        data: { title: 'پاسخ های پیشفرض' }
      },
      {
        path: 'faq',
        component: FAQPage,
        data: { title: 'سوالات متداول' }
      },
      {
        path: 'faq-category',
        component: FAQCategoryPage,
        data: { title: 'دسته بندی سوالات متداول' }
      },
      {
        path: 'ticket',
        component: TicketPage,
        data: { title: 'تیکت های ارسال شده' }
      },
      {
        path: '',
        redirectTo: 'operator'
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
