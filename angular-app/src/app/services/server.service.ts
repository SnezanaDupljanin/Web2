import { Injectable } from '@angular/core';
//import { Http, Response } from '@angular/http';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';

import {Observable} from 'rxjs';
import { LoginUser } from '../models/loginUser.model';
import { PriceListItem } from '../models/priceListItem.model';
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

  getStations() : Observable<any>{
    return this.httpClient.get('http://localhost:52295/api/Station');
  } 

  getStationLines() : Observable<any>{
    return this.httpClient.get('http://localhost:52295/api/StationLine');
  } 


  getTimeTable() : Observable<any>{
    return this.httpClient.get('http://localhost:52295/api/TimeTable');
  }

  logOut() : any{
    return this.httpClient.post("http://localhost:52295/api/Account/Logout", httpOptions);
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

  putLine(Line_Id : number, line: Line): Observable<any>{
    return this.httpClient.put(`http://localhost:52295/api/Line/${Line_Id}`, line );
  }

  putStation(Station_Id : number, station: Station): Observable<any>{
    return this.httpClient.put(`http://localhost:52295/api/Station/${Station_Id}`, station );
  }

  deleteLine(Line_Id :number) :any{
    return this.httpClient.delete(`http://localhost:52295/api/Line/${Line_Id}`);
  }

  deleteStation(Station_Id :number) :any{
    return this.httpClient.delete(`http://localhost:52295/api/Station/${Station_Id}`);
  }

}
