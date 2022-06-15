import { Component, OnInit } from '@angular/core';
import { TableConfig } from '@core/models';
import { FilterConfig } from '@core/models/apis';
import { NgDialogFormConfig, NgDialogFormInputTypes } from '@ng/models/overlay';
import { UtilsService } from '@ng/services/utils.service';
import { FAQCategoryService } from '../faq-category/faq-category.service';
import { DefaultAnswer } from './default-answer';
import { DefaultAnswerService } from './default-answer.service';

@Component({
  selector: 'ng-default-answer',
  templateUrl: './default-answer.page.html'
})
export class DefaultAnswerPage implements OnInit {

  constructor(private defaultAnswerService: DefaultAnswerService, private categoryService: FAQCategoryService, private utilsService: UtilsService) {
  }
  categories = [];
  async ngOnInit() {
    this.categories = (await this.categoryService.getFAQCategories({ page_number: 1, page_limit: 30 }).toPromise()).data.faq_categories;
    this.config.colDef=[
      {
        header: 'عنوان',
        field: 'title',
        type: 'text',
      },
      {
        header: '	پاسخ',
        field: 'answer',
        type: 'text'
      },
      {
        header: '	دسته',
        field: 'category',
        type: 'text',
        options:this.categories,
        optionLabel: 'title',
        optionValue: 'category_id',
        subField:'title'
      },
    ];
    this.loadData({ page_number: 1, page_limit: 10 });
  }

  defaultAnswer: DefaultAnswer[] = [];
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
        this.openModifydefaultAnswerDialog(params.col);
      if (params.action == 'onSwitchChange') {

      }
      if (params.action == 'onDelete') {
        this.deletedefaultAnswer(params.col.default_answer_id)
      }
    },
    onHeaderActionClick: (params) => {
      if (params == "onAdd")
        this.openModifydefaultAnswerDialog();
    },
    onSearch: (params) => {
      this.loadData({ search_text: params, page_number: 1, page_limit: 10 });
    }
  };

  async loadData(filter?: FilterConfig) {
    let data = (await this.defaultAnswerService.getDefaultAnswers(filter).toPromise()).data;
    this.config.total = data.total_counts;
    this.defaultAnswer = data.default_answers;
  }

  openModifydefaultAnswerDialog(value?: DefaultAnswer) {
    let dialogFormConfig: NgDialogFormConfig[] = value
      ? [{
        type: 'text',
        formControlName: 'default_answer_id',
        visible: false,
        value: value.default_answer_id,
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
          this.defaultAnswerService.editDefaultAnswer(res).toPromise();
        } else {
          // this.defaultAnswerService.addDefaultAnswer(res).toPromise();
        }
      }
    });
  }

  async deletedefaultAnswer(default_answer_id) {
    const dialogRes = await this.utilsService.showConfirm({
      header: 'حذف ',
      message: 'آیا از حذف این دسته بندی مطمئن هستید؟',
      rtl: true
    });
    if (dialogRes) {
      await this.defaultAnswerService.removeDefaultAnswer(default_answer_id).toPromise();
      this.loadData();
    }
  }
}