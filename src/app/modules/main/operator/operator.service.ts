import {Injectable} from '@angular/core';
import {ApiService} from '@core/http';
import {Observable} from 'rxjs';
import {Operator, TransferOperatorTickets} from "@modules/main/operator/operator";
import {FilterConfig} from "@core/models/apis";

@Injectable({
  providedIn: 'root',
})
export class OperatorService extends ApiService {

  constructor() {
    super();
  }

  getOperators(data: FilterConfig): Observable<any> {
    return this._post(``,
      {
        method: 'getOperators',
        data,
      }
    )
  }

  addOperator(data: Operator): Observable<any> {
    return this._post(``,
      {
        method: 'addOperator',
        data,
      }
    );
  }

  editOperator(data: Operator): Observable<any> {
    return this._post(``,
      {
        method: 'editOperator',
        data,
      }
    );
  }

  transferOperatorTickets(data: TransferOperatorTickets): Observable<any> {
    return this._post(``,
      {
        method: 'transferOperatorTickets',
        data,
      }
    );
  }
}
