import {Injectable} from '@angular/core';
import {ApiService} from '@core/http';
import {Observable} from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class FAQCategoryService extends ApiService {

  constructor() {
    super();
  }

  getFAQCategories(data): Observable<any[]> {
    return this._post(``,
      {
        method: 'getFAQCategories',
        data: data,
        auth: ''
      }
    );
  }

  addFAQCategory(data): Observable<any[]> {
    return this._post(``,
      {
        method: 'addFAQCategory',
        data: data,
        auth: ''
      }
    );
  }

  editFAQCategory(data): Observable<any[]> {
    return this._post(``,
      {
        method: 'editFAQCategory',
        data: data,
        auth: ''
      }
    );
  }

  removeFAQCategory(data): Observable<any[]> {
    return this._post(``,
      {
        method: 'removeFAQCategory',
        data: data,
        auth: ''
      }
    );
  }
}
