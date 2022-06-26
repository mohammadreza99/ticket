import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { TableConfig } from '@core/models';
import { FilterConfig } from '@core/models/apis';
import { NgDialogFormConfig, NgDialogFormInputTypes } from '@ng/models/overlay';
import { UtilsService } from '@ng/services';
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
    private cdr: ChangeDetectorRef
  ) { }
  @HostListener("window:scroll", ["$event"])
  onWindowScroll() {
    let pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
    let max = document.documentElement.scrollHeight;
    if (Math.floor(pos) == max) {
      this.pageInfo = { page_number: this.pageInfo.page_number + 1, page_limit: 10 }
      Object.assign(this.filter, this.pageInfo);
      this.loadData(this.filter);
    }
  }
  FAQCategories = [];
  allOperators: Operator[];
  pageInfo = { page_number: 1, page_limit: 10 };
  filter = {};
  activeTabIndex = 0;
  gettingConversation = false;
  async ngOnInit() {
    this.FAQCategories = (
      await this._FAQCategoryService
        .getFAQCategories({ page_number: 1, page_limit: 30 })
        .toPromise()
    ).data.faq_categories;
    this.allOperators = (
      await this.operatorService
        .getOperators({
          page_number: 1,
          page_limit: 100,
        })
        .toPromise()
    ).data.operators;
    this.loadData(this.pageInfo);
  }
  ticketConversations = [];
  ticket: Ticket[] = [];


  async loadData(filter?: FilterConfig) {
    let data = (await this.ticketService.getTickets(filter).toPromise()).data;
    this.ticket.push(...data.tickets);
  }

  async deleteFAQ(ticket_id) {
    const dialogRes = await this.utilsService.showConfirm({
      header: 'بستن تیکت ',
      message: 'آیا از بسته شدن این  تیکت مطمئن هستید؟',
      rtl: true,
    });
    if (dialogRes) {
      await this.ticketService
        .closeTicket(ticket_id)
        .toPromise()
        .then((result) => {
          if (result.status == 'OK') {
            this.utilsService.showToast({
              severity: 'success',
              position: 'top-right',
              detail: 'بسته شدن تیکت  با موفقیت انجام شد',
            });
            Object.assign(this.filter, this.pageInfo);
            this.loadData(this.filter);
          }
        });
    }
  }
  async openConversation(conversation) {
    if (!this.ticketConversations.find(item => item.ticket_id == conversation.ticket_id)) {
      this.gettingConversation = true;
      let ticketConversations = await (await this.ticketService.getTicketConversations({ page_number: 1, page_limit: 50, ticket_id: conversation.ticket_id }).toPromise()).data.conversations;
      Object.assign(conversation, { ticketConversations: ticketConversations })
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
}


