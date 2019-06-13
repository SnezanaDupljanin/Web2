import { Component, OnInit } from '@angular/core';
import { ServerService } from '../services/server.service';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-verify-profile',
  templateUrl: './verify-profile.component.html',
  styleUrls: ['./verify-profile.component.css']
})
export class VerifyProfileComponent implements OnInit {

  unapprovedUsers:Array<any> = [];
  

  constructor(private serverService: ServerService, private router: Router, private notificationService: NotificationService) { }
  
  ngOnInit() {
    this.callGetAllUsers();
  }

  callGetAllUsers(){
    this.serverService.getAllUsers()
    .subscribe(
      data => {
        data.forEach(element => {
          if(!element.Active){
            this.unapprovedUsers.push(element);
          }
        });
      },
      error => {
        console.log(error);
      }
    )
  }

  approveUser(user){
    user.Active = true;
    this.serverService.putUser(user.Id,user)
    .subscribe(
      data =>{
       console.log("OK");
      },
      error => {
        console.log(error);
      }
    )
  }

  refuseUser(user){
    user.Active = false;
    this.serverService.putUser(user.Id,user)
    .subscribe(
      data =>{
       console.log("OK");
      },
      error => {
        console.log(error);
      }
    )
  }
}
