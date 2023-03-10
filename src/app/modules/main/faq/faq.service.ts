import {Injectable} from '@angular/core';
import {ApiService} from '@core/http';
import {Observable} from 'rxjs';
import {FilterConfig, ResponseConfig} from "@core/models/apis";
import {FAQ} from "@modules/main/faq/faq";


@Injectable({
  providedIn: 'root',
})
export class FAQService extends ApiService {

  constructor() {
    super();
  }

  getFAQs(filter: FilterConfig): Observable<ResponseConfig> {
    return this._post(``,
      {
        method: 'getFAQs',
        data: {...filter},
      }
    );
  }

  addFAQ(data: FAQ): Observable<ResponseConfig> {
    return this._post(``,
      {
        method: 'addFAQ',
        data,
      }
    );
  }

  editFAQ(data: FAQ): Observable<ResponseConfig> {
    return this._post(``,
      {
        method: 'editFAQ',
        data,
      }
    );
  }

  removeFAQ(faq_id: number): Observable<ResponseConfig> {
    return this._post(``,
      {
        method: 'removeFAQ',
        data: {faq_id},
      }
    );
  }
}
