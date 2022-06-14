import { Component, OnInit } from '@angular/core';
import { TableConfig } from '@core/models';

@Component({
  selector: 'ng-ticket',
  templateUrl: './ticket.page.html'
})
export class TicketPage implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  data=[];
  config: TableConfig = {
    colDef: [
      {
        header: 'نام شرکت',
        field: 'name',
        type: 'text',
      },

    ],
    actionConfig: [
      {
        header: 'ویرایش',
        field: 'onEdit',
        icon: 'pi pi-pencil',
      },
    ],
    onFetch: (params) => {
      // this.pageInfo.startIndex = params.startIndex*params.pageSize;
      // this.pageInfo.pageSize = params.pageSize;
      // this.loadData();
    },
    onColActionClick: (params) => {
      // this.onColActionClick(params);
    },
    onHeaderActionClick: (params) => {
      // this.onHeaderActionClick(params);
    },
  };

}
