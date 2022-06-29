import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { TableConfig } from '@core/models';
import { FilterConfig } from '@core/models/apis';
import { NgDialogFormConfig, NgDialogFormInputTypes } from '@ng/models/overlay';
import { UtilsService } from '@ng/services';
import { FAQCategory } from '../faq-category/faq-category';
import { FAQCategoryService } from '../faq-category/faq-category.service';
import { FAQService } from '../faq/faq.service';
import { Operator } from '../operator/operator';
import { OperatorService } from '../operator/operator.service';
import { Conversation, Ticket } from './ticket';
import { TicketService } from './ticket.service';

@Component({
  selector: 'ng-ticket',
  templateUrl: './ticket.page.html',
  styleUrls: ['./ticket.page.scss']
})
export class TicketPage implements OnInit {
  constructor(
    private ticketService: TicketService,
    private _FAQCategoryService: FAQCategoryService,
    private utilsService: UtilsService,
    private operatorService: OperatorService,
    private categoryService: FAQCategoryService,
    private cdr: ChangeDetectorRef
  ) { }
  @HostListener("window:scroll", ["$event"])
  onWindowScroll() {
    let pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
    let max = document.documentElement.scrollHeight;
    if (Math.floor(pos) == max) {
      if (!this.gettingTickets && !this.finishedTickets) {
        this.pageInfo = { page_number: this.pageInfo.page_number + 1, page_limit: 10 }
        Object.assign(this.filter, this.pageInfo);
        this.loadData(this.filter);
      }
    }
  }
  allOperators: Operator[];
  allCategories: FAQCategory[];
  pageInfo = { page_number: 1, page_limit: 10 };
  filter = {};
  activeTabIndex = 0;
  gettingConversation = false;
  gettingTickets = false;
  finishedTickets = false;
  ticketConversations = [];
  ticket: Ticket[] = [];
  ticketStatus = [
    {
      value: 'UserWaiting',
      label: 'در انتظار کاربر'
    },
    {
      value: 'AdminWaiting',
      label: 'در انتظار ادمین'
    },
    {
      value: 'Closed',
      label: 'بسته شده'
    },
  ];
  status = 'AdminWaiting';
  operator;
  category;
  username;

  async ngOnInit() {
    this.allOperators = (await this.operatorService.getOperators({ page_number: 1, page_limit: 100 }).toPromise()).data.operators;
    this.allCategories = (await this.categoryService.getFAQCategories({ page_number: 1, page_limit: 30 }).toPromise()).data.faq_categories;
    this.loadData(this.pageInfo);
  }
  async loadData(filter?: FilterConfig) {
    this.gettingTickets = true;
    let data = (await this.ticketService.getTickets(filter).toPromise()).data;
    if (data.tickets.length != 0)
      this.ticket.push(...data.tickets);
    else this.finishedTickets = true;
    this.gettingTickets = false;
  }
  async openConversation(conversation) {
    console.log(conversation);

    if (!this.ticketConversations.find(item => item.ticket_id == conversation.ticket_id)) {
      this.gettingConversation = true;
      // let ticketConversations = await (await this.ticketService.getTicketConversations({ page_number: 1, page_limit: 50, ticket_id: conversation.ticket_id }).toPromise()).data.conversations;
      // Object.assign(conversation, { ticketConversations: ticketConversations })
      this.ticketConversations.push(conversation);
      setTimeout(() => {
        this.activeTabIndex = this.ticketConversations.length - 1;
        this.gettingConversation = false;
      }, 10);
    }
    else {
      let index = this.ticketConversations.findIndex(item => item.ticket_id == conversation.ticket_id);
      setTimeout(() => {
        this.activeTabIndex = index;
      }, 10);
    }
  }
  closeConvesation(tab) {
    this.ticketConversations.splice(tab.index, 1);
    setTimeout(() => {
      this.activeTabIndex = this.ticketConversations.length - 1;
    }, 10);
  }
  onAnsweredTicket(ticket_id) {
    let index = this.ticketConversations.findIndex(item => item.ticket_id == ticket_id);
    this.closeConvesation({ index: index })
  }
  async closeTicket(ticket) {
    console.log(ticket);
    const dialogRes = await this.utilsService.showConfirm({
      header: 'حذف ',
      message: 'آیا از بستن این تیکت مطمئن هستید؟',
      rtl: true
    });
    if (dialogRes) {
      this.ticketService.closeTicket(ticket.ticket_id).toPromise().then((result) => {
        if (result.status == 'OK') {
          this.utilsService.showToast({
            severity: 'success',
            position: 'top-right',
            detail: 'بستن تیکت با موفقیت انجام شد',
          });

        }
      })
    }
  }
  onFilter() {
    setTimeout(() => {
      let filter = {}
      this.pageInfo = { page_number: 1, page_limit: 10 };
      Object.assign(filter, { status: this.status });
      Object.assign(filter, { category_id: this.category });
      Object.assign(filter, { username: this.username });
      Object.assign(this.filter, { operator_id: this.operator });
      Object.assign(this.filter, { filter: filter });
      Object.assign(this.filter, this.pageInfo);
      this.ticket = [];
      this.finishedTickets = false;
      this.loadData(this.filter);
    }, 0);
  }
}


