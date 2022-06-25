import {Injectable} from '@angular/core';
import {ApiService} from '@core/http';
import {Observable} from 'rxjs';
import {FilterConfig, ResponseConfig} from "@core/models/apis";
import {TicketStatus} from "@modules/main/ticket/ticket";

@Injectable({
  providedIn: 'root',
})
export class TicketService extends ApiService {

  constructor() {
    super();
  }

  getTickets(filter: FilterConfig): Observable<ResponseConfig> {
    return this._post(``,
      {
        method: 'getTickets',
        data: {...filter}
      }
    );
  }

  answerTicket(ticket_id: number, answer: string, close_ticket: boolean): Observable<ResponseConfig> {
    return this._post(``,
      {
        method: 'answerTicket',
        data: {ticket_id, answer, close_ticket}
      }
    );
  }

  closeTicket(ticket_id: number): Observable<ResponseConfig> {
    return this._post(``,
      {
        method: 'closeTicket',
        data: {ticket_id}
      }
    );
  }

  getTicketConversations(filter): Observable<ResponseConfig> {
    return this._post(``,
      {
        method: 'getTicketConversations',
        data: {...filter}
      }
    );
  }
}
