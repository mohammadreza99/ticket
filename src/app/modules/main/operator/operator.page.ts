import { Component, OnInit } from '@angular/core';
import { TableConfig } from '@core/models';
import { NgDialogFormConfig, NgDialogFormInputTypes } from '@ng/models/overlay';
import { UtilsService } from '@ng/services';
import { OperatorService } from './operator.service';

@Component({
  selector: 'ng-operator',
  templateUrl: './operator.page.html'
})
export class OperatorPage implements OnInit {

  constructor(private operatorService: OperatorService, private utilsService: UtilsService) {
  }

  ngOnInit() {
    this.loadData();
  }

  pageInfo = {
    page_number: 1,
    page_limit: 10
  }
  operators;
  allOperators;
  config: TableConfig = {
    colDef: [
      {
        header: 'نام',
        field: 'name',
        type: 'text',
      },
      {
        header: 'نام کاربری',
        field: 'username',
        type: 'text',
      },
      // {
      //   header: 'allowed_ips',
      //   field: 'name',
      //   type: 'text',
      // },
      {
        header: 'وضعیت',
        field: 'status',
        type: 'text',
        options: [
          {
            label: 'فعال',
            value: 'Active'
          },
          {
            label: 'غیر فعال',
            value: 'Inactive'
          }
        ],
        templateString: (res) => {
          if (res.status == 'Active')
            return `فعال`
          else
            return 'غیر فعال'
        }
      },
      {
        header: 'مجموع تیکت ها',
        field: 'total_ticket_count',
        type: 'text',
      },
      {
        header: 'تیکت های بسته شده',
        field: 'closed_ticket_count',
        type: 'text',
      },

    ],
    actionConfig: [
      {
        header: 'ویرایش',
        field: 'onEdit',
        icon: 'fad fa-pencil',
      },
      {
        header: 'انتقال تیکت',
        field: 'onTransform',
        icon: 'fad fa-retweet',
      },
    ],
    onFetch: (params) => {
      this.pageInfo.page_number = params.startIndex + 1;
      this.pageInfo.page_limit = params.pageSize;
      this.loadData();
    },
    onColActionClick: (params) => {
      if (params.action == 'onTransform')
        this.openTransformOperatorDialog(params.col.operator_id)
      if (params.action == 'onEdit')
        this.openModifyOperatorDialog(params.col)
    },
    onHeaderActionClick: (params) => {

      if (params == "onAdd")
        this.openModifyOperatorDialog();
    },
    onSearch: (params) => {
      this.pageInfo.page_number = 1;
      this.loadData(params);
    }
  };

  async loadData(searchText = null) {
    let filterObj = this.pageInfo;
    if (searchText)
      Object.assign(filterObj, {
        search_text: searchText
      })
    let data: any = (await this.operatorService.getOperators(filterObj).toPromise()).data;
    this.config.total = data.total_counts;
    this.allOperators = (await this.operatorService.getOperators({
      page_number: 1,
      page_limit: data.total_counts,
    }).toPromise()).data;
    this.operators = data.operators;
    this.allOperators = this.allOperators.operators;

  }

  openTransformOperatorDialog(operatorId) {
    let dialogFormConfig: NgDialogFormConfig[] = [];
    dialogFormConfig.push({
      type: 'multi-select',
      formControlName: 'target_operator_ids',
      label: 'انتقال به سایر اوپراتور ها',
      labelPos: 'fix-top',
      className: '',
      labelWidth: 200,
      optionValue: 'operator_id',
      optionLabel: 'username',
      display: 'chip',
      options: this.allOperators,
      value: []
    });
    dialogFormConfig.push({
      type: 'switch',
      formControlName: 'deactivate_user',
      label: 'غیر فعال کردن کاربر',
      labelPos: 'fix-top',
      className: '',
      labelWidth: 200,
      value: false
    });
    dialogFormConfig.push({
      type: 'text',
      formControlName: 'operator_id',
      visible: false,
      value: operatorId
    });
    const dialogform = this.utilsService.showDialogForm(
      'مدیریت',
      dialogFormConfig,
      {
        width: '70%',
        rtl: true,
      }
    );
    dialogform.onClose.subscribe((res) => {
      if (res) {
        this.operatorService.transferOperatorTickets(res).toPromise();
      }
    });
  }

  openModifyOperatorDialog(value = null) {
    let dialogFormConfig: NgDialogFormConfig[] = value
      ? [
        {
          type: 'text',
          formControlName: 'operator_id',
          visible: false,
          value: value.id,
        },
      ]
      : [];
    this.config.colDef.forEach((item) => {
      if (!item.templateString)
        dialogFormConfig.push({
          type: item.type as NgDialogFormInputTypes,
          formControlName: item.field,
          label: item.header,
          labelWidth: 200,
          value: value ? value[item.field] : '',
          className: 'col-12 col-md-6',
        });
      else
        dialogFormConfig.push({
          type: 'dropdown',
          formControlName: item.field,
          label: item.header,
          labelWidth: 200,
          value: value ? value[item.field] : '',
          className: 'col-12 col-md-6',
          options: item.options,
        });
    });

    const dialogform = this.utilsService.showDialogForm(
      value ? 'ویرایش' : 'افزودن',
      dialogFormConfig,
      {
        width: '70%',
        rtl: true,
      }
    );
    dialogform.onClose.subscribe((res) => {
      if (res) {
        console.log(res);
        if (value)
          this.operatorService.editOperator(res).toPromise();
        else
          this.operatorService.addOperator(res).toPromise();
      }
    });
  }
}
