import {Injectable} from '@angular/core';
import {ApiService} from '@core/http';
import {FilterConfig} from "@core/models/apis";


@Injectable({
  providedIn: 'root',
})
export class BugService extends ApiService {

  constructor() {
    super();
  }

  getBugs(filter: FilterConfig, user_id: number) {
    return this._post(``,
      {
        method: 'getBugs',
        data: {...filter, user_id},
      }
    );
  }

  closeBug(bug_id: number) {
    return this._post(``,
      {
        method: 'closeBug',
        data: {bug_id},
      }
    );
  }
}
