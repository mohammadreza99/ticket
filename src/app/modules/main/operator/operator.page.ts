import { Component, OnInit } from '@angular/core';
import { TableConfig } from '@core/models';
import { NgDialogFormConfig, NgDialogFormInputTypes } from '@ng/models/overlay';
import { UtilsService } from '@ng/services';
import { OperatorService } from './operator.service';
import { FilterConfig } from '@core/models/apis';
import { Operator } from '@modules/main/operator/operator';

@Component({
  selector: 'ng-operator',
  templateUrl: './operator.page.html',
})
export class OperatorPage implements OnInit {
  constructor(
    private operatorService: OperatorService,
    private utilsService: UtilsService
  ) {}

  ngOnInit() {
    this.loadData({ page_number: 1, page_limit: 10 });
  }

  operators: Operator[];
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
      {
        header: 'allowed_ips',
        field: 'allowed_ips',
        type: 'text',
        templateString: (res) => {
          let ips = '';
          for (const item of res.allowed_ips) {
            ips += `<span class="chips"> ${item} </span>`;
          }
          return ips;
        },
      },
      {
        header: 'وضعیت',
        field: 'status',
        type: 'text',
        templateString: (res) => {
          if (res.status == 'Active') return `فعال`;
          else return 'غیر فعال';
        },
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
      this.loadData({
        page_number: params.startIndex + 1,
        page_limit: params.pageSize,
      });
    },
    onColActionClick: (params) => {
      if (params.action == 'onTransform')
        this.openTransformOperatorDialog(params.col.operator_id);
      if (params.action == 'onEdit') this.openModifyOperatorDialog(params.col);
    },
    onHeaderActionClick: (params) => {
      if (params == 'onAdd') this.openModifyOperatorDialog();
    },
    onSearch: (params) => {
      this.loadData({ search_text: params, page_number: 1, page_limit: 10 });
    },
  };

  async loadData(filter?: FilterConfig) {
    let data = (await this.operatorService.getOperators(filter).toPromise())
      .data;
    this.config.total = data.total_counts;
    this.operators = data.operators;
  }

  openModifyOperatorDialog(value?: Operator) {
    let dialogFormConfig: NgDialogFormConfig[] = [
      {
        type: 'text',
        formControlName: 'name',
        label: 'نام',
        labelWidth: 200,
        value: value ? value['name'] : '',
        className: 'col-12 col-md-6',
      },
      {
        type: 'text',
        formControlName: 'username',
        label: 'نام کاربری',
        labelWidth: 200,
        value: value ? value['username'] : '',
        className: 'col-12 col-md-6',
      },
      {
        type: 'text',
        formControlName: 'password',
        label: 'رمز عبور',
        labelWidth: 200,
        value: value ? value['password'] : '',
        className: 'col-12 col-md-6',
      },
      {
        type: 'dropdown',
        formControlName: 'status',
        label: 'وضعیت',
        labelWidth: 200,
        value: value ? value['status'] : '',
        className: 'col-12 col-md-6',
        options: [
          {
            label: 'فعال',
            value: 'Active',
          },
          {
            label: 'غیر فعال',
            value: 'Inactive',
          },
        ],
      },
      {
        type: 'chips',
        formControlName: 'allowed_ips',
        label: 'allowed_ips',
        labelWidth: 200,
        value: value ? value['allowed_ips'] : '',
        className: 'col-12 col-md-6',
      },
    ];
    if (value)
      dialogFormConfig.push({
        type: 'text',
        formControlName: 'operator_id',
        visible: false,
        value: value.operator_id,
      });

    this.utilsService
      .showDialogForm(value ? 'ویرایش' : 'افزودن', dialogFormConfig, {
        width: '70%',
        rtl: true,
      })
      .onClose.subscribe((res) => {
        if (res) {
          if (value) {
            if (this.getUpdatedParameters(value, res).length != 0) {
              Object.assign(res, {
                updated_parameters: this.getUpdatedParameters(value, res),
              });
              this.operatorService.editOperator(res).toPromise().then((result)=>{
                if(result.status=="OK"){
                  this.utilsService.showToast({
                    severity: 'success',
                    position: 'top-right',
                    detail: 'ویرایش با موفقیت انجام شد',
                  });
                  this.loadData({ page_number: 1, page_limit: 10 });
                }
              });
            }
          } else {
            this.operatorService.addOperator(res).toPromise().then((result)=>{
              if(result.status=="OK"){
              this.utilsService.showToast({
                severity: 'success',
                position: 'top-right',
                detail: 'افزودن با موفقیت انجام شد',
              });
              this.loadData({ page_number: 1, page_limit: 10 });
            }
            });
          }
        }
      });
  }
  getUpdatedParameters(oldVal, newVal) {
    let updatedParameters = [];
    for (const key in newVal) {
      if (newVal[key] != oldVal[key]) updatedParameters.push(key);
    }
    return updatedParameters;
  }
  async openTransformOperatorDialog(operatorId: number) {
    const operators = (
      await this.operatorService
        .getOperators({
          page_number: 1,
          page_limit: this.config.total,
        })
        .toPromise()
    ).data.operators;
    let dialogFormConfig: NgDialogFormConfig[] = [
      {
        type: 'multi-select',
        display: 'chip',
        formControlName: 'target_operator_ids',
        label: 'انتقال به سایر اوپراتور ها',
        labelPos: 'fix-top',
        className: '',
        labelWidth: 200,
        optionValue: 'operator_id',
        optionLabel: 'username',
        options: operators,
        value: [],
      },
      {
        type: 'switch',
        formControlName: 'deactivate_user',
        label: 'غیر فعال کردن کاربر',
        labelPos: 'fix-top',
        className: '',
        labelWidth: 200,
        value: false,
      },
      {
        type: 'text',
        formControlName: 'operator_id',
        visible: false,
        value: operatorId,
      },
    ];
    this.utilsService
      .showDialogForm('مدیریت', dialogFormConfig, {
        width: '70%',
        rtl: true,
      })
      .onClose.subscribe((res) => {
        if (res) {
          this.operatorService.transferOperatorTickets(res).toPromise();
        }
      });
  }
}
