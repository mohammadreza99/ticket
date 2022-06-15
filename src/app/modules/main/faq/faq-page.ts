import { Component, OnInit } from '@angular/core';
import { TableConfig } from '@core/models';
import { FilterConfig } from '@core/models/apis';
import { NgDialogFormConfig, NgDialogFormInputTypes } from '@ng/models/overlay';
import { UtilsService } from '@ng/services/utils.service';
import { FAQCategoryService } from '../faq-category/faq-category.service';
import { OperatorService } from '../operator/operator.service';
import { FAQ } from './faq';
import { FAQService } from './faq.service';

@Component({
  selector: 'ng-faq',
  templateUrl: './faq.page.html'
})
export class FAQPage implements OnInit {

  constructor(private _FAQService: FAQService, private _FAQCategoryService: FAQCategoryService, private utilsService: UtilsService) {
  }
  FAQCategories = [];
  async ngOnInit() {
    this.FAQCategories = (await this._FAQCategoryService.getFAQCategories({ page_number: 1, page_limit: 30 }).toPromise()).data.faq_categories;
    this.config.colDef=[
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
        header: '	سوال',
        field: 'question_text',
        type: 'text'
      },
      {
        header: '	پاسخ',
        field: 'answer_text',
        type: 'text'
      },
      {
        header: '	دسته',
        field: 'category',
        type: 'text',
        options:this.FAQCategories,
        optionLabel: 'title',
        optionValue: 'category_id',
        subField:'title'
      },
      {
        header: '	عمومی',
        field: 'is_published',
        type: 'switch'
      },
    ];
    this.loadData({ page_number: 1, page_limit: 10 });
  }

  FAQ: FAQ[] = [];
  config: TableConfig = {
    colDef: [],
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
        this.openModifyFAQDialog(params.col);
      if (params.action == 'onSwitchChange') {

      }
      if (params.action == 'onDelete') {
        this.deleteFAQ(params.col.faq_id)
      }
    },
    onHeaderActionClick: (params) => {
      if (params == "onAdd")
        this.openModifyFAQDialog();
    },
    onSearch: (params) => {
      this.loadData({ search_text: params, page_number: 1, page_limit: 10 });
    }
  };

  async loadData(filter?: FilterConfig) {
    let data = (await this._FAQService.getFAQs(filter).toPromise()).data;
    this.config.total = data.total_counts;
    this.FAQ = data.faqs;
  }

  openModifyFAQDialog(value?: FAQ) {
    let dialogFormConfig: NgDialogFormConfig[] = value
      ? [{
        type: 'text',
        formControlName: 'faq_id',
        visible: false,
        value: value.faq_id,
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
          options: item.options,
          optionLabel: 'title',
          optionValue: 'category_id',
        });
        else{
          if(item.field=='category')
          dialogFormConfig.push({
            type: 'dropdown',
            formControlName: item.field,
            label: item.header,
            labelWidth: 200,
            value: value ? value[item.field].category_id : '',
            className: 'col-12 col-md-6',
            options: item.options,
            optionLabel: 'title',
            optionValue: 'category_id',
          });
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
          Object.assign(res, {
            updated_parameters: ['title']
          })
          this._FAQService.editFAQ(res).toPromise();
        } else {
          this._FAQService.addFAQ(res).toPromise();
        }
      }
    });
  }

  async deleteFAQ(faq_id) {
    const dialogRes = await this.utilsService.showConfirm({
      header: 'حذف ',
      message: 'آیا از حذف این دسته بندی مطمئن هستید؟',
      rtl: true
    });
    if (dialogRes) {
      await this._FAQService.removeFAQ(faq_id).toPromise();
      this.loadData();
    }
  }
}