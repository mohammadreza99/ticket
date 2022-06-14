import {Injectable} from '@angular/core';
import {ApiService} from '@core/http';
import {Observable} from 'rxjs';
import {FilterConfig} from "@core/models/apis";
import {TicketStatus} from "@modules/main/ticket/ticket";

@Injectable({
  providedIn: 'root',
})
export class TicketService extends ApiService {

  constructor() {
    super();
  }

  getTickets(filter: FilterConfig, username: string, status: TicketStatus): Observable<any> {
    return this._post(``,
      {
        method: 'getTickets',
        data: {...filter, username, status}
      }
    );
  }

  answerTicket(ticket_id: number, answer: string, close_ticket: boolean): Observable<any> {
    return this._post(``,
      {
        method: 'answerTicket',
        data: {ticket_id, answer, close_ticket}
      }
    );
  }

  closeTicket(ticket_id: number): Observable<any> {
    return this._post(``,
      {
        method: 'closeTicket',
        data: {ticket_id}
      }
    );
  }

  getTicketConversations(filter: FilterConfig, ticket_id: number): Observable<any> {
    return this._post(``,
      {
        method: 'getTicketConversations',
        data: {...filter, ticket_id}
      }
    );
  }
}
