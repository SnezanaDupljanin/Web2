import { Injectable } from '@angular/core';
//import { Http, Response } from '@angular/http';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';

import {Observable} from 'rxjs';
import { LoginUser } from '../models/loginUser.model';
import { PriceListItem } from '../models/priceListItem.model';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  constructor(private httpClient: HttpClient) { }

  registerAppUser(appUser: any) : any {
    return this.httpClient.post("http://localhost:52295/api/Account/Register", appUser);
  }
  getTheToken(loginUser : LoginUser) : Observable<any>{
    let headers = new HttpHeaders();
    headers = headers.append('Content-type','application/x-www-form-urlencoded');

    return this.httpClient.post('http://localhost:52295/oauth/token', 'username='+loginUser.UserName+'&password='+loginUser.Password+'&grant_type=password',{"headers": headers});

  }
  getItems() : Observable<any>{
    return this.httpClient.get('http://localhost:52295/api/Item');
  } 

  getCoefficinets():  Observable<any>{
    return this.httpClient.get('http://localhost:52295/api/Coefficient');
  }

  getPrices():  Observable<any>{
    return this.httpClient.get('http://localhost:52295/api/PriceListItem');
  }

  getLines() : Observable<any>{
    return this.httpClient.get('http://localhost:52295/api/Line');
  } 

  getTimeTable() : Observable<any>{
    return this.httpClient.get('http://localhost:52295/api/TimeTable');
  }

}
