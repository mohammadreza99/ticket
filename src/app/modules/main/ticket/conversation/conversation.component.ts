import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { DefaultAnswer } from '@modules/main/default-answer/default-answer';
import { DefaultAnswerService } from '@modules/main/default-answer/default-answer.service';
import { Operator } from '@modules/main/operator/operator';
import { GalleriaThumbnails } from 'primeng/galleria';
import { Conversation, User } from '../ticket';
import { TicketService } from '../ticket.service';

@Component({
  selector: 'ng-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class ConversationComponent implements OnInit {

  constructor(private defaultAnswerService: DefaultAnswerService, private ticketService: TicketService) { }

  async ngOnInit() {
    this.defaultAnswers = (await this.defaultAnswerService.getDefaultAnswers({ page_number: 1, page_limit: 50, category_id: this.category_id }).toPromise()).data.default_answers;
  }
  @Input() set ticketConversation(value) {
    console.log(value);
    this.category_id = value.category?.category_id
    this.conversations = value.ticketConversations;
    this.user = value.user;
    this.operator = value.operator;
    this.ticket_id = value.ticket_id;
  }
  @Output() answeredTicket = new EventEmitter();
  conversations;
  user;
  operator;
  ticket_id;
  category_id;
  defaultAnswers: DefaultAnswer[] = [];
  answer;
  closed: boolean = false
  selectDefultAnswer(args) {
    console.log(args.value);
    this.answer = this.defaultAnswers.find(item => item.default_answer_id == args.value).answer;
  }
  sendAnswer() {
    console.log(this.closed);
    // this.ticketService.answerTicket(this.ticket_id,this.answer,this.closed).toPromise().then(()=>{
    //  this.answeredTicket.emit(this.ticket_id)
    // }
    // )
  }
}
