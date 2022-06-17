import {Injectable} from '@angular/core';
import {ApiService} from '@core/http';
import {DefaultAnswer} from "@modules/main/default-answer/default-answer";
import {FilterConfig, ResponseConfig} from "@core/models/apis";
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class DefaultAnswerService extends ApiService {

  constructor() {
    super();
  }

  addDefaultAnswer(data:DefaultAnswer): Observable<ResponseConfig> {
    return this._post(``,
      {
        method: 'addDefaultAnswer',
        data,
      }
    );
  }
  editDefaultAnswer(data: DefaultAnswer): Observable<ResponseConfig> {
    return this._post(``,
      {
        method: 'editDefaultAnswer',
        data,
      }
    );
  }

  
  removeDefaultAnswer(default_answer_id: number) : Observable<ResponseConfig>{
    return this._post(``,
      {
        method: 'RemoveDefaultAnswer',
        data: {default_answer_id},
      }
    );
  }

  getDefaultAnswers(filter: FilterConfig): Observable<ResponseConfig>{
    return this._post(``,
      {
        method: 'getDefaultAnswers',
        data: {...filter},
      }
    );
  }
}
