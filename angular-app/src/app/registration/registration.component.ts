import { Component, OnInit } from '@angular/core';
import { AppUser } from '../models/appUser.model';
import { ServerService } from '../services/server.service';
import {Router} from '@angular/router';
import { NgForm } from '@angular/forms';
import { LoginUser } from '../models/loginUser.model';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
  providers: [ ServerService]
})
export class RegistrationComponent implements OnInit {

  errors: any[] = [];
  validationMessage: string = "";
  today:Date;
  constructor(private serverService: ServerService, private router: Router, private notificationService: NotificationService) { }
  
  ngOnInit() {
    this.today=new Date();
  }
  Registrate(appUser: AppUser, form: NgForm) {
    this.errors = [];
    this.serverService.registerAppUser(appUser)
      .subscribe(
        data => {
          this.serverService.getTheToken(new LoginUser(appUser.Email, appUser.Password))
            .subscribe(
              res => {
                let jwt = res.access_token;

                let jwtData = jwt.split('.')[1]
                let decodedJwtJsonData = window.atob(jwtData)
                let decodedJwtData = JSON.parse(decodedJwtJsonData)

                let role = decodedJwtData.role
                console.log(role);

                localStorage.setItem('jwt', jwt)
                localStorage.setItem('role', role)

                this.router.navigate(['']);

                //this.notificationService.startConnection();
              },
              err => {
                this.validationMessage = err.error.error_description;
                console.log(err);
              }
            )
        },
        error => {
          console.log(error);
          for (var key in error.error.ModelState) {
            for (var i = 0; i < error.error.ModelState[key].length; i++) {
              this.errors.push(error.error.ModelState[key][i]);
            }
          }
        }
      )
  }


}
