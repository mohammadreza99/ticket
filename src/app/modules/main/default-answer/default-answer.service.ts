import {Injectable} from '@angular/core';
import {ApiService} from '@core/http';


@Injectable({
  providedIn: 'root',
})
export class DefaultAnswerService extends ApiService {

  constructor() {
    super();
  }

  addDefaultAnswer(category_id, answer, title) {
    return this._post(``,
      {
        method: 'removeFAQ',
        data: {category_id, answer, title},
      }
    );
  }

  editDefaultAnswer(default_answer_id, category_id, answer, title, updated_parameters) {
    return this._post(``,
      {
        method: 'removeFAQ',
        data: {default_answer_id, category_id, answer, title, updated_parameters},
      }
    );
  }

  RemoveDefaultAnswer(default_answer_id) {
    return this._post(``,
      {
        method: 'removeFAQ',
        data: {default_answer_id},
      }
    );
  }

  getDefaultAnswers(category_id, search_text, page_limit, page_number) {
    return this._post(``,
      {
        method: 'removeFAQ',
        data: {category_id, search_text, page_limit, page_number},
      }
    );
  }
}
