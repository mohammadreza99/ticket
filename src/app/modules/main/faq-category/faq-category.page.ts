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
  templateUrl: './faq-category.page.html'
})
export class FAQCategoryPage implements OnInit {
  constructor(private _FAQCategoryService: FAQCategoryService, private operatorService: OperatorService, private utilsService: UtilsService) {
  }

  async ngOnInit() {
    this.loadData({ page_number: 1, page_limit: 30 });
    this.allOperators = (await this.operatorService.getOperators({
      page_number: 1,
      page_limit: 100,
    }).toPromise()).data.operators;
  }

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
          let operators = ''
          for (const item of res.operators) {
            operators += `<span class="chips"> ${item.name} </span>`;
          }
          return operators;
        }
      },
      {
        header: 'شاخه',
        field: 'parent_category',
        type: 'text',
        subField: 'title'
      },
      {
        header: '	عمومی',
        field: 'is_published',
        type: 'switch'
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
      this.loadData({ page_number: params.startIndex + 1, page_limit: params.pageSize });
    },
    onColActionClick: (params) => {
      if (params.action == 'onEdit')
        this.openModifyFAQCategoryDialog(params.col);
      if (params.action == 'onSwitchChange') { 

      }
      if (params.action == 'onDelete') {
        this.deleteFAQCategory(params.col.category_id)
      }
    },
    onHeaderActionClick: (params) => {
      if (params == "onAdd")
        this.openModifyFAQCategoryDialog();
    },
    onSearch: (params) => {
      this.loadData({ search_text: params, page_number: 1, page_limit: 10 });
    }
  };

  async loadData(filter?: FilterConfig) {
    let data = (await this._FAQCategoryService.getFAQCategories(filter).toPromise()).data;
    this.config.total = data.total_counts;
    this.FAQCategories = data.faq_categories;
  }

  openModifyFAQCategoryDialog(value?: FAQCategory) {
    let dialogFormConfig: NgDialogFormConfig[] = value
      ? [{
        type: 'text',
        formControlName: 'category_id',
        visible: false,
        value: value.category_id,
      }]
      : [];
    this.config.colDef.forEach((item) => {
      if (!item.templateString && !item.subField)
        dialogFormConfig.push({
          type: item.type as NgDialogFormInputTypes,
          formControlName: item.field,
          label: item.header,
          labelWidth: 200,
          value: value ? value[item.field] : '',
          className: 'col-12 col-md-6',
        });
      else {
        if (item.field == "operators") {
          let operator_ids=value[item.field].map(item => item.operator_id)
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
        if (item.field == "parent_category") {
          let allFAQCategories = [];
          this.FAQCategories.forEach(cat => {
            if (cat?.category_id != value?.category_id) {
              allFAQCategories.push(cat)
            }
          })

          dialogFormConfig.push({
            type: 'dropdown',
            formControlName: item.field,
            label: item.header,
            labelWidth: 200,
            value: value && value[item.field] ? value[item.field]['category_id'] : '',
            className: 'col-12 col-md-6',
            options: value ? allFAQCategories : this.FAQCategories,
            optionValue: 'category_id',
            optionLabel: 'title',
          });
        }
      }
    });
    this.utilsService.showDialogForm(
      value ? 'ویرایش' : 'افزودن',
      dialogFormConfig,
      {
        width: '70%',
        rtl: true,
      }
    ).onClose.subscribe((res) => {
      if (res) {
        if (value) {
          console.log(res);
          
          Object.assign(res,{
            operator_ids:res.operators,
            parent_category_id:res.parent_category,
            updated_parameters:['title']
          })
          this._FAQCategoryService.editFAQCategory(res).toPromise();
        } else {
          this._FAQCategoryService.addFAQCategory(res).toPromise();
        }
      }
    });
  }

  async deleteFAQCategory(category_id) {
    const dialogRes = await this.utilsService.showConfirm({
      header: 'حذف ',
      message: 'آیا از حذف این دسته بندی مطمئن هستید؟',
      rtl: true
    });
    if (dialogRes) {
      await this._FAQCategoryService.removeFAQCategory(category_id).toPromise();
      this.loadData();
    }
  }

}
