import { Component, OnInit } from '@angular/core';
import { TableConfig } from '@core/models';
import { FilterConfig } from '@core/models/apis';
import { NgDialogFormConfig, NgDialogFormInputTypes } from '@ng/models/overlay';
import { UtilsService } from '@ng/services';
import { LogoComponent } from '@shared/components/logo/logo.component';
import { Operator } from '../operator/operator';
import { OperatorService } from '../operator/operator.service';
import { FAQCategory } from './faq-category';
import { FAQCategoryService } from './faq-category.service';

@Component({
  selector: 'ng-faq-category',
  templateUrl: './faq-category.page.html',
})
export class FAQCategoryPage implements OnInit {
  constructor(
    private _FAQCategoryService: FAQCategoryService,
    private operatorService: OperatorService,
    private utilsService: UtilsService
  ) {}

  async ngOnInit() {
    this.loadData(this.pageInfo);
    this.allOperators = (
      await this.operatorService
        .getOperators({
          page_number: 1,
          page_limit: 100,
        })
        .toPromise()
    ).data.operators;
  }
  pageInfo={ page_number: 1, page_limit: 30 }
  FAQCategories: FAQCategory[] = [];
  allOperators: Operator[];
  config: TableConfig = {
    colDef: [
      {
        header: 'عنوان',
        field: 'title',
        type: 'text',
      },
      {
        header: 'اولویت',
        field: 'priority',
        type: 'text',
      },
      {
        header: 'اپراتور ها',
        field: 'operators',
        type: 'text',
        templateString: (res) => {
          let operators = '';
          if(res.operators)
          for (const item of res?.operators) {
            operators += `<span class="chips"> ${item?.name} </span>`;
          }
          return operators;
        },
      },
      {
        header: 'شاخه',
        field: 'parent_category',
        type: 'text',
        subField: 'title',
      },
      {
        header: '	عمومی',
        field: 'is_published',
        type: 'switch',
      },
    ],
    actionConfig: [
      {
        header: 'ویرایش',
        field: 'onEdit',
        icon: 'fad fa-pencil',
      },
      {
        header: 'حذف',
        field: 'onDelete',
        icon: 'fad fa-trash',
      },
    ],
    onFetch: (params) => {
      this.pageInfo={
        page_number: params.startIndex + 1,
        page_limit: params.pageSize,
      }
      this.loadData(this.pageInfo);
    },
    onColActionClick: (params) => {
      if (params.action == 'onEdit')
        this.openModifyFAQCategoryDialog(params.col);
      if (params.action == 'onSwitchChange') {
        let obj: FAQCategory = new FAQCategory();
        Object.assign(obj, {
          category_id: params.col.category_id,
          is_published: !params.col.is_published,
          updated_parameters: ['is_published'],
        });
        this._FAQCategoryService
          .editFAQCategory(obj)
          .toPromise()
          .then((result) => {
            if (result.status == 'OK') {
              this.utilsService.showToast({
                severity: 'success',
                position: 'top-right',
                detail: 'ویرایش با موفقیت انجام شد',
              });
              this.loadData(this.pageInfo);
            }
          });
      }
      if (params.action == 'onDelete') {
        this.deleteFAQCategory(params.col.category_id);
      }
    },
    onHeaderActionClick: (params) => {
      if (params == 'onAdd') this.openModifyFAQCategoryDialog();
    },
    onSearch: (params) => {
      this.pageInfo.page_number=1;
      this.loadData({ search_text: params, ...this.pageInfo });
    },
  };

  async loadData(filter?: FilterConfig) {
    let data = (
      await this._FAQCategoryService.getFAQCategories(filter).toPromise()
    ).data;
    this.config.total = data.total_counts;
    this.FAQCategories = data.faq_categories;
  }

  openModifyFAQCategoryDialog(value?: FAQCategory) {
    let dialogFormConfig: NgDialogFormConfig[] = value
      ? [
          {
            type: 'text',
            formControlName: 'category_id',
            visible: false,
            value: value.category_id,
          },
        ]
      : [];
    this.config.colDef.forEach((item) => {
      if (!item.templateString && !item.subField)
        dialogFormConfig.push({
          type: item.type as NgDialogFormInputTypes,
          formControlName: item.field,
          label: item.header,
          labelWidth: 200,
          value: value ? value[item.field] : item.type=='switch'?false:'' ,
          className: 'col-12 col-md-6',
        });
      else {
        if (item.field == 'operators') {
          let operator_ids = [];
          if (value)
            operator_ids = value[item.field]?.map((item) => item?.operator_id);
          dialogFormConfig.push({
            type: 'multi-select',
            display: 'chip',
            formControlName: item.field,
            label: item.header,
            labelWidth: 200,
            value: value ? operator_ids : '',
            className: 'col-12',
            options: this.allOperators,
            optionValue: 'operator_id',
            optionLabel: 'name',
          });
        }
        if (item.field == 'parent_category') {
          let allFAQCategories = [];
          this.FAQCategories.forEach((cat) => {
            if (cat?.category_id != value?.category_id) {
              allFAQCategories.push(cat);
            }
          });

          dialogFormConfig.push({
            type: 'dropdown',
            formControlName: item.field,
            label: item.header,
            labelWidth: 200,
            value:
              value && value[item.field]
                ? value[item.field]['category_id']
                : '',
            className: 'col-12 col-md-6',
            options: value ? allFAQCategories : this.FAQCategories,
            optionValue: 'category_id',
            optionLabel: 'title',
          });
        }
      }
    });
    this.utilsService
      .showDialogForm(value ? 'ویرایش' : 'افزودن', dialogFormConfig, {
        width: '70%',
        rtl: true,
      })
      .onClose.subscribe((res) => {
        if (res) {
          Object.assign(res, {
            operator_ids: res.operators,
            parent_category_id: res.parent_category,
          });
          delete res.operators;
          delete res.parent_category;
          if (value) {
            if (this.getUpdatedParameters(value, res).length != 0) {
              Object.assign(res, {
                updated_parameters: this.getUpdatedParameters(value, res),
              });
              this._FAQCategoryService
                .editFAQCategory(res)
                .toPromise()
                .then((result) => {
                  if (result.status == 'OK') {
                    this.utilsService.showToast({
                      severity: 'success',
                      position: 'top-right',
                      detail: 'ویرایش با موفقیت انجام شد',
                    });
                    this.loadData(this.pageInfo);
                  }
                });
            }
          } else {
            this._FAQCategoryService
              .addFAQCategory(res)
              .toPromise()
              .then((result) => {
                if (result.status == 'OK') {
                  this.utilsService.showToast({
                    severity: 'success',
                    position: 'top-right',
                    detail: 'افزودن با موفقیت انجام شد',
                  });
                  this.loadData(this.pageInfo);
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
  async deleteFAQCategory(category_id) {
    const dialogRes = await this.utilsService.showConfirm({
      header: 'حذف ',
      message: 'آیا از حذف این دسته بندی مطمئن هستید؟',
      rtl: true,
    });
    if (dialogRes) {
      await this._FAQCategoryService.removeFAQCategory(category_id).toPromise().then((result) => {
        if (result.status == 'OK') {
          this.utilsService.showToast({
            severity: 'success',
            position: 'top-right',
            detail: 'حذف با موفقیت انجام شد',
          });
          this.loadData(this.pageInfo);
        }
      });
    }
  }
}
