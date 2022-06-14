import {Injectable} from '@angular/core';
import {ApiService} from '@core/http';
import {DefaultAnswer} from "@modules/main/default-answer/default-answer";
import {FilterConfig} from "@core/models/apis";


@Injectable({
  providedIn: 'root',
})
export class DefaultAnswerService extends ApiService {

  constructor() {
    super();
  }

  addDefaultAnswer(category_id: number, answer: string, title: string) {
    return this._post(``,
      {
        method: 'removeFAQ',
        data: {category_id, answer, title},
      }
    );
  }

  editDefaultAnswer(data: DefaultAnswer) {
    return this._post(``,
      {
        method: 'removeFAQ',
        data,
      }
    );
  }

  RemoveDefaultAnswer(default_answer_id: number) {
    return this._post(``,
      {
        method: 'removeFAQ',
        data: {default_answer_id},
      }
    );
  }

  getDefaultAnswers(filter: FilterConfig, category_id: number) {
    return this._post(``,
      {
        method: 'removeFAQ',
        data: {...filter, category_id},
      }
    );
  }
}
