import { Component, OnInit } from '@angular/core';
import { AppUser } from '../models/appUser.model';
import { ServerService } from '../services/server.service';
import { Router } from '@angular/router';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginUser } from '../models/loginUser.model';
import { NotificationService } from '../services/notification.service';
import { CustomValidators } from '../custom/custom-validators';
import { PasswordValidation } from '../PasswordValidation';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
  providers: [ServerService]
})
export class RegistrationComponent {

  errors: any[] = [];
  validationMessage: string = "";
  today: Date;
  public frmSignup: FormGroup;
  user: AppUser;

  appUser = this.fb.group({
    Name: ["",[Validators.required,Validators.minLength(4)]],
    LastName: ["",[Validators.required,
    Validators.minLength(5)]],
    DateOfBirth:["", [Validators.required]],
    Type:["", [Validators.required]],
    Email:["", [Validators.email, Validators.required]],
    Address: ["",[Validators.required,
    CustomValidators.patternValidator(/\d/, {hasNumber: true
    }),Validators.minLength(6)]],
    Password:["",[
      Validators.required,CustomValidators.patternValidator(/\d/, {hasNumber: true}),
      CustomValidators.patternValidator(/[A-Z]/, {hasCapitalCase: true}),
      CustomValidators.patternValidator(/[a-z]/, {hasSmallCase: true}),
      CustomValidators.patternValidator(/[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,{hasSpecialCharacters: true}),
      Validators.minLength(8)
    ]],
    ConfirmPassword:["",[Validators.required]],
    File:[""],
  }, {
    validator: PasswordValidation.MatchPassword // your validation method
  });

  constructor(private fb: FormBuilder, private serverService: ServerService, private router: Router, private notificationService: NotificationService) {
  }

  onSubmit() {
    if(this.appUser != null)
    {
      this.user = new AppUser;
      this.user.Name = this.appUser.value.Name;
      this.user.LastName = this.appUser.value.LastName;
      this.user.Email = this.appUser.value.Email;
      this.user.Address = this.appUser.value.Address;
      this.user.Password = this.appUser.value.Password;
      this.user.ConfirmPassword = this.appUser.value.ConfirmPassword;
      this.user.DateOfBirth = this.appUser.value.DateOfBirth;
      this.user.ImageUrl = this.appUser.value.ImageUrl;
      this.user.Type = this.appUser.value.Type;

      this.Registrate(this.user);
    }
  }
  get f() { return this.appUser.controls; }
  Registrate(aU: AppUser) {
    this.errors = [];
    this.serverService.registerAppUser(aU)
      .subscribe(
        data => {
          this.serverService.getTheToken(new LoginUser(aU.Email, aU.Password))
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
 /* createSignupForm(): FormGroup {
    return this.fb.group(
      {
        confirmPassword: [null, Validators.compose([Validators.required])]
      },
      {
        // check whether our password and confirm password match
        validator: CustomValidators.passwordMatchValidator
      }
    );
  }*/
}
