import {Injectable} from '@angular/core';
import {ApiService} from '@core/http';
import {Observable} from 'rxjs';
import {Operator, TransferOperatorTickets} from "@modules/main/operator/operator";
import {SearchData} from "@core/models/apis";

@Injectable({
  providedIn: 'root',
})
export class OperatorService extends ApiService {

  constructor() {
    super();
  }

  getOperators(data: SearchData): Observable<any[]> {
    return this._post(``,
      {
        method: 'getOperators',
        data,
        api_version: '0'
      }
    )
  }

  addOperator(data: Operator): Observable<any[]> {
    return this._post(``,
      {
        method: 'addOperator',
        data,
        api_version: '0'
      }
    );
  }

  editOperator(data: Operator): Observable<any[]> {
    return this._post(``,
      {
        method: 'editOperator',
        data,
        api_version: '0'
      }
    );
  }

  transferOperatorTickets(data: TransferOperatorTickets): Observable<any[]> {
    return this._post(``,
      {
        method: 'transferOperatorTickets',
        data,
        api_version: '0'
      }
    );
  }
}
