import { Component, OnInit } from '@angular/core';
import { ServerService } from '../services/server.service';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';
import { Ticket } from '../models/ticket.model';

@Component({
  selector: 'app-validate-ticket',
  templateUrl: './validate-ticket.component.html',
  styleUrls: ['./validate-ticket.component.css']
})
export class ValidateTicketComponent implements OnInit {

  tickets:Array<Ticket> = [];
  now:Date;
  purchase:Date;
  result:string;

  constructor(private serverService: ServerService, private router: Router, private notificationService: NotificationService) { }

  ngOnInit() {
    this.callGetAllTickets();
  }

  callGetAllTickets(){
    this.serverService.getAllTickets()
    .subscribe(
      data => {
        this.tickets = data;
          
      },
      error => {
        console.log(error);
      }
    )
  }

  validateTicket(ticket){

    this.serverService.updateTicket(ticket.Id,ticket).subscribe(
      data =>{
        this.result = data;
      },error => {
        console.log(error);
      });
  }
}

