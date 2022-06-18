import {Injectable} from '@angular/core';
import {ApiService} from '@core/http';
import {Observable} from 'rxjs';
import {FilterConfig, ResponseConfig} from "@core/models/apis";
import {FAQCategory} from "@modules/main/faq-category/faq-category";


@Injectable({
  providedIn: 'root',
})
export class FAQCategoryService extends ApiService {

  constructor() {
    super();
  }

  getFAQCategories(filter: FilterConfig): Observable<ResponseConfig> {
    return this._post(``,
      {
        method: 'getFAQCategories',
        data: {...filter},
      }
    );
  }

  addFAQCategory(data: FAQCategory): Observable<ResponseConfig> {
    return this._post(``,
      {
        method: 'addFAQCategory',
        data,
      }
    );
  }

  editFAQCategory(data: FAQCategory): Observable<ResponseConfig> {
    return this._post(``,
      {
        method: 'editFAQCategory',
        data,
      }
    );
  }

  removeFAQCategory(category_id: number): Observable<ResponseConfig> {
    return this._post(``,
      {
        method: 'removeFAQCategory',
        data: {category_id:category_id},
      }
    );
  }
}
