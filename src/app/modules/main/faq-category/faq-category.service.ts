import {Injectable} from '@angular/core';
import {ApiService} from '@core/http';
import {Observable} from 'rxjs';
import {FilterConfig} from "@core/models/apis";
import {FAQCategory} from "@modules/main/faq-category/faq-category";


@Injectable({
  providedIn: 'root',
})
export class FAQCategoryService extends ApiService {

  constructor() {
    super();
  }

  getFAQCategories(filter: FilterConfig): Observable<any[]> {
    return this._post(``,
      {
        method: 'getFAQCategories',
        data: {...filter},
      }
    );
  }

  addFAQCategory(data: FAQCategory): Observable<any[]> {
    return this._post(``,
      {
        method: 'addFAQCategory',
        data,
      }
    );
  }

  editFAQCategory(data: FAQCategory): Observable<any[]> {
    return this._post(``,
      {
        method: 'editFAQCategory',
        data,
      }
    );
  }

  removeFAQCategory(category_id: number): Observable<any[]> {
    return this._post(``,
      {
        method: 'removeFAQCategory',
        data: {category_id},
      }
    );
  }
}
