import { Component } from '@angular/core';
import {Router} from '@angular/router';
import { ServerService } from "../app/services/server.service"
import { isGeneratedFile } from '@angular/compiler/src/aot/util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'angular-app';
  divCOntroler : boolean;

  constructor(private serverService: ServerService, private router: Router){}

  ngOnInit(){
    this.router.navigate([this.router.url]);
    if(localStorage.role=="Controller"){
      this.divCOntroler = true;
    }else{
      this.divCOntroler = false;
    }
  }

  public showLogIn(){
    if(!localStorage.jwt){
        return true;
    }else{
      return false;
    }
  }

  public showLogOut(){
    
    if(localStorage.jwt){
        return true;
    }else{
      return false;
    }
  }

  public callLogout(){
    this.serverService.logOut()
    .subscribe(
      data => {
        this.divCOntroler = false;
        localStorage.clear();
        this.router.navigate(['/Login']);     
      },
      err => {
        console.log();
      }
    )
  }
}

