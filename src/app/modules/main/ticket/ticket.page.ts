import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
    this.config.colDef = [
      {
        header: 'متن تیکت',
        field: 'ticket_text',
        type: 'text',
      },
      {
        header: 'نام کاربری',
        field: 'user',
        type: 'text',
        subField: 'username',
        filterOption: {
          field: 'user'
        }

      },
      {
        header: '	آخرین پیام',
        field: 'last_conversation_text',
        type: 'text',
      },
      {
        header: '	زمان پاسخ گویی',
        field: 'last_conversation_time',
        type: 'time',
      },
      {
        header: '	دسته',
        field: 'category',
        type: 'dropdown',
        options: this.FAQCategories,
        optionLabel: 'title',
        optionValue: 'category_id',
        filterOption: {
          field: 'category',
          optionLabel: 'title',
          optionValue: 'category_id',
        },
      },
      {
        header: 'اپراتور',
        field: 'operator',
        type: 'dropdown',
        options: this.allOperators,
        optionLabel: 'name',
        optionValue: 'operator_id',
        filterOption: {
          field: 'operator',
          optionLabel: 'name',
          optionValue: 'operator_id',
        },
      },
      {
        header: 'وضعیت',
        field: 'status',
        type: 'dropdown',
        options: [
          {
            id: 'UserWaiting',
            name: 'در انتظار کاربر'
          },
          {
            id: 'AdminWaiting',
            name: 'در انتظار ادمین'
          },
          {
            id: 'Closed',
            name: 'بسته شده'
          },
        ],
        optionLabel: 'name',
        optionValue: 'id',
        filterOption: {
          field: 'status',
          optionLabel: 'name',
          optionValue: 'id',
        },
      },
      {
        header: 'رضایت کاربر',
        field: 'user_satisfaction',
        type: 'text',
        templateString: (res) => {
          if (res.user_satisfaction == true) return `بله`;
          else return 'خیر';
        },
      },
    ];
    this.loadData(this.pageInfo);
  }
  ticketConversations = [];
  ticket: Ticket[] = [];
  config: TableConfig = {
    colDef: [],
    actionConfig: [
      {
        header: 'مکالمه',
        field: 'onConversation',
        icon: 'fad fa-comments',
      },
      {
        header: 'پاسخ',
        field: 'onAnswer',
        icon: 'fad fa-comment',
      },
      {
        header: 'بستن',
        field: 'onClose',
        icon: 'fas fa-times',
      },
    ],
    onFilter: (params) => {
      Object.assign(this.filter, { operator_id: params.operator });
      Object.assign(this.filter, {
        filter: {
          category_id: params.category,
          status: params.status,
          username: params.user
        }
      });
      if (!this.filter['filter'].category_id) delete this.filter['filter'].category_id;
      if (!this.filter['filter'].status) delete this.filter['filter'].status;
      if (!this.filter['filter'].username) delete this.filter['filter'].username;
      if (!this.filter['operator_id']) delete this.filter['operator_id'];
      Object.assign(this.filter, this.pageInfo);
      this.loadData(this.filter);
    },
    onFetch: (params) => {
      this.pageInfo = {
        page_number: params.startIndex + 1,
        page_limit: params.pageSize,
      };
      Object.assign(this.filter, this.pageInfo);
      this.loadData(this.filter);
    },
    onColActionClick: async (params) => {
      if (params.action == 'onDelete') {
        // this.deleteFAQ(params.col.ticket_id);
      }
      if (params.action == 'onConversation') {
        if (!this.ticketConversations.find(item => item.ticket_id == params.col.ticket_id)) {
          let ticketConversations = await (await this.ticketService.getTicketConversations({ page_number: 1, page_limit: 50, ticket_id: params.col.ticket_id }).toPromise()).data.conversations;
          Object.assign(params.col, { ticketConversations: ticketConversations })
          this.ticketConversations.push(params.col);
          setTimeout(() => {

            this.activeTabIndex = this.ticketConversations.length;
          }, 10);
          console.log(this.activeTabIndex);

        }

      }
    },
    onSearch: (params) => {
      this.pageInfo.page_number = 1;
      Object.assign(this.filter, { search_text: params });
      Object.assign(this.filter, this.pageInfo);
      this.loadData(this.filter);
    },
  };

  async loadData(filter?: FilterConfig) {
    let data = (await this.ticketService.getTickets(filter).toPromise()).data;
    this.config.total = data.total_counts;
    this.ticket = data.tickets;
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
    this.closeConvesation({index:index})
  }
}


// const dialogRes = await this.utilsService.showConfirm({
//   header: 'حذف ',
//   message: 'آیا از حذف این دسته بندی مطمئن هستید؟',
//   rtl: true
// });
// if (dialogRes) {}