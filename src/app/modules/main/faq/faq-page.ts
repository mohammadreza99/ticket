import { Component, OnInit } from '@angular/core';
import { TableConfig } from '@core/models';

@Component({
  selector: 'ng-faq',
  templateUrl: './faq.page.html'
})
export class FAQPage implements OnInit {

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
