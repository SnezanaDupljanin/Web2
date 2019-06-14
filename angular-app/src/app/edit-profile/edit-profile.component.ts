import { Component, OnInit } from '@angular/core';
import { LoginUser } from '../models/loginUser.model';
import { ServerService } from '../services/server.service';
import {Router} from '@angular/router';
import { NgForm, FormBuilder, Validators } from '@angular/forms'
import { AppUser } from '../models/appUser.model';
import { CustomValidators } from '../custom/custom-validators';
import { PasswordValidation } from '../PasswordValidation';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
  providers: [ ServerService]
})
export class EditProfileComponent implements OnInit {

  validationMessage: string = "";
  nesto:any;
  user: AppUser=new AppUser();
  id: string;

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


  constructor(private fb: FormBuilder, private serverService: ServerService, private router: Router) {
  }
  ngOnInit()
  {
    //his.user = new AppUser;
    //this.user.Name = "Snezana";
    this.getUserInfo();    
  }
  getUserInfo() : any {

    this.serverService.getUserDetails()
    .subscribe(
      data => {
        //this.nesto = res[0];
        this.user = data;
        this.appUser.value.Name=this.user.Name;
        this.appUser.value.LastName =this.user.LastName;
        this.appUser.value.Email=this.user.Email;
        this.appUser.value.Address = this.user.Address;
        this.appUser.value.Password = this.user.Password;
        this.appUser.value.ConfirmPassword = this.user.ConfirmPassword;
        this.appUser.value.DateOfBirth = this.user.DateOfBirth;
        this.appUser.value.ImageUrl =this.user.ImageUrl;
        this.appUser.value.Type = this.user.Type ;
      },
      err => {
        this.validationMessage = err.error.error_description;
        console.log(err);
      }
    )      
} 
get f() { return this.appUser.controls; }

onSubmit()
{
  this.UpdateUser(this.user);
}

UpdateUser(user: AppUser)
{
  this.user.Name = this.appUser.value.Name;
  this.user.LastName = this.appUser.value.LastName;
  this.user.Email = this.appUser.value.Email;
  this.user.Address = this.appUser.value.Address;
  this.user.Password = this.appUser.value.Password;
  this.user.ConfirmPassword = this.appUser.value.ConfirmPassword;
  this.user.DateOfBirth = this.appUser.value.DateOfBirth;
  this.user.ImageUrl = this.appUser.value.ImageUrl;
  this.user.Type = this.appUser.value.Type;

  var u = this.user;
  u.Name = this.user.Name+'|'+this.user.Password;
  this.id = this.user.Email.split('@')[0];

  this.serverService.putUser(this.id, u)
    .subscribe(
      data => {
        console.log('ok');
        this.router.navigate(['']);
      },
      err => {
        this.validationMessage = err.error.error_description;
        console.log(err);
      }
    )      
}

}
