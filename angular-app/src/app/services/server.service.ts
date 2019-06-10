import { Injectable } from '@angular/core';
//import { Http, Response } from '@angular/http';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';

import {Observable} from 'rxjs';
import { LoginUser } from '../models/loginUser.model';
import { PriceListItem } from '../models/priceListItem.model';
import { Ticket } from '../models/ticket.model';
import { Station } from '../models/station.model';
import { Line } from '../models/line.model';
import { StationLine } from '../models/stationLine.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}

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

  logOut() : any{
    return this.httpClient.post("http://localhost:52295/api/Account/Logout", httpOptions);
  }

  getUserDetails() : any {
    return this.httpClient.get('http://localhost:52295/api/AppUser/0', httpOptions)
  }

  postTicket(ticket: Ticket): Observable<any>{
    return this.httpClient.post("http://localhost:52295/api/Ticket", ticket);
  }

  postStation(station: Station): Observable<any>{
    return this.httpClient.post("http://localhost:52295/api/Station", station);
  }

  postLine(line: Line): Observable<any>{
    return this.httpClient.post("http://localhost:52295/api/Line", line);
  }

  postStationLine(stationLine:StationLine){
    return this.httpClient.post("http://localhost:52295/api/StationLine", stationLine);
  }

  getStations() : Observable<any>{
    return this.httpClient.get('http://localhost:52295/api/Station');
  } 

  getStationLines() : Observable<any>{
    return this.httpClient.get('http://localhost:52295/api/StationLine');
  } 
}
