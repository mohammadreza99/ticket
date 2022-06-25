import {FAQCategoryAbs} from "@modules/main/faq/faq";

export class Ticket {
  ticket_id: number;
  category: FAQCategoryAbs;
  ticket_text: string;
  user: User;
  answer: string;
  answer_time: string;
  user_satisfaction: boolean;
  status: TicketStatus;
  last_conversation_text: string;
  last_conversation_answer: string;
  last_conversation_time: string;
  operator: OperatorAbs;
}

export interface User {
  user_id: number,
  username: string,
  first_name: string,
  last_name: string
}

export interface OperatorAbs {
  operator_id: number,
  name: string,
  username: string
}
export interface Conversation {
  conversation_answer: string,
  conversation_id: string,
  conversation_text: string,
  create_time: number
}

export type TicketStatus = 'UserWaiting' | 'AdminWaiting' | 'Closed'
