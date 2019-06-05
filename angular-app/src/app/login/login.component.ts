import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms'
import {Router} from '@angular/router';
import { LoginUser } from '../models/loginUser.model';
import { ServerService } from '../services/server.service';
import { NotificationService } from '../services/notification.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [ ServerService]
})
export class LoginComponent implements OnInit {

  validationMessage: string = "";

  constructor(private serverService: ServerService, private router: Router, private notificationService: NotificationService) { }

  ngOnInit() {
    localStorage.clear();
  }

  Login(loginUser : LoginUser, form: NgForm){
    this.serverService.getTheToken(loginUser)
    .subscribe(
      res => {
        let jwt = res.access_token;

        let jwtData = jwt.split('.')[1]
        let decodedJwtJsonData = window.atob(jwtData)
        let decodedJwtData = JSON.parse(decodedJwtJsonData)
        
        let role = decodedJwtData.role
        console.log(role);
        localStorage.setItem('jwt',jwt)
        localStorage.setItem('role',role)
        this.router.navigate(['']);
        
        //this.notificationService.startConnection();
      },
      err => {
        this.validationMessage = err.error.error_description;
        console.log(err);
      }
    )      
} 
}
