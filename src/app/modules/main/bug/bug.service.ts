import {Injectable} from '@angular/core';
import {ApiService} from '@core/http';


@Injectable({
  providedIn: 'root',
})
export class BugService extends ApiService {

  constructor() {
    super();
  }

  getBugs(page_number, page_limit, user_id) {
    return this._post(``,
      {
        method: 'getBugs',
        data: {page_number, page_limit, user_id},
      }
    );
  }

  closeBug(bug_id) {
    return this._post(``,
      {
        method: 'closeBug',
        data: {bug_id},
      }
    );
  }
}
