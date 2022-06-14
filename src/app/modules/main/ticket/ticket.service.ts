import {Injectable} from '@angular/core';
import {ApiService} from '@core/http';
import {Observable} from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class TicketService extends ApiService {

  constructor() {
    super();
  }

  getTickets(data): Observable<any[]> {
    return this._post(``,
      {
        method: 'getTickets',
        data: data
      }
    );
  }

  answerTicket(data): Observable<any[]> {
    return this._post(``,
      {
        method: 'answerTicket',
        data: data
      }
    );
  }

  closeTicket(data): Observable<any[]> {
    return this._post(``,
      {
        method: 'closeTicket',
        data: data
      }
    );
  }

  getTicketConversations(data): Observable<any[]> {
    return this._post(``,
      {
        method: 'getTicketConversations',
        data: data
      }
    );
  }
}
