import {Injectable} from '@angular/core';
import {ApiService} from '@core/http';
import {Observable} from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class FAQService extends ApiService {

  constructor() {
    super();
  }

  getFAQs(data): Observable<any[]> {
    return this._post(``,
      {
        method: 'getFAQs',
        data: data,
        auth: ''
      }
    );
  }

  addFAQ(data): Observable<any[]> {
    return this._post(``,
      {
        method: 'addFAQ',
        data: data,
        auth: ''
      }
    );
  }

  editFAQ(data): Observable<any[]> {
    return this._post(``,
      {
        method: 'editFAQ',
        data: data,
        auth: ''
      }
    );
  }

  removeFAQ(data): Observable<any[]> {
    return this._post(``,
      {
        method: 'removeFAQ',
        data: data,
        auth: ''
      }
    );
  }
}
