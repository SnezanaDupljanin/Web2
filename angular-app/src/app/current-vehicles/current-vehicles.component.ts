import { Component, OnInit, NgZone } from '@angular/core';
import { ServerService } from '../services/server.service';
import { MapsAPILoader } from '@agm/core';
import { MarkerInfo } from '../map/model/marker-info.model';
import { Polyline } from '../map/model/polyline';
import { GeoLocation } from '../map/model/geolocation';
import { Station } from '../models/station.model';
import { Line } from '../models/line.model';
import { HttpClickService } from '../services/click-http.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-current-vehicles',
  templateUrl: './current-vehicles.component.html',
  styleUrls: ['./current-vehicles.component.css'],
  styles: ['agm-map {height: 500px; width: 1000px;}'], //postavljamo sirinu i visinu mape
  providers: [ServerService]
})

export class CurrentVehiclesComponent implements OnInit {

  markerInfo: MarkerInfo;
  public polyline: Polyline;
  public zoom: number;
  private geoCoder;
  lines:Array<any> = [];
  stations: Array<any>=[];
  stationLines:Array<any>=[];
  lineNames:Array<string>=[];
  radioSelected:string; //selektovana linija
  radioSel:string; //selektovana linija
  stationIds : Array<number>=[];
  stationsToDraw:Array<Station> = [];
  line_ID:number;
  num:number = 0;
  latMarker:number;
  longMarker:number;
  geoLocations:Array<GeoLocation> = [];

  isConnected: Boolean;
  notifications: string[];
  time: string;
  
  constructor(private ngZone: NgZone, private serverService: ServerService, private mapsAPILoader: MapsAPILoader,private notifService: NotificationService, private http: HttpClickService) { 

    this.isConnected = false;
    this.notifications = [];

    this.markerInfo = new MarkerInfo(new GeoLocation(45.242268, 19.842954),
      "assets/ftn.png",
      "Jugodrvo", "", "http://ftn.uns.ac.rs/691618389/fakultet-tehnickih-nauka");

    this.polyline = new Polyline([], 'blue', { url: "assets/busicon.png", scaledSize: { width: 50, height: 50 } });
  }

  ngOnInit() {
    
  
    this.callGetLines();
    this.callGetStations();
    this.callGetStationLine();

    this.checkConnection();

    this.subscribeForNotifications();
    

    this.mapsAPILoader.load().then(() => {

      this.geoCoder = new google.maps.Geocoder;
     // this.getAddress(45.242268, 19.842954); //proba

    });
    
    this.notifService.startConnection();
  }

  callGetLines(){
    this.serverService.getLines()
      .subscribe(
        data => {
          this.lines = data;  
          this.lines.forEach(x=>{
            this.lineNames.push(x.Name+x.Direction);
          });      
        },
        error => {
          console.log(error);
        }
      )
  }

  callGetStationLine(){
    this.serverService.getStationLines()
      .subscribe(
        data => {
          this.stationLines = data;  
             
        },
        error => {
          console.log(error);
        }
      )
  }

  callGetStations(){
    this.serverService.getStations()
      .subscribe(
        data => {
          this.stations = data;        
        },
        error => {
          console.log(error);
        }
      )
  }

  onItemChange1(line){
    
    //this.stopTimer();
    
    this.onClick();
    this.subscribeForTime();

    this.stationIds = [];
    this.stationsToDraw = [];
    this.radioSel = this.lineNames.find(Item => Item === this.radioSelected);
    var lineName = line.substring(0, this.radioSel.length-1);
    var direction = line.substring(this.radioSel.length-1);
    this.line_ID = this.lines.find(Line => Line.Name == lineName && Line.Direction==direction).Id;

    this.stationLines.forEach(sl=>{
      if(sl.Line_Id==this.line_ID)
        this.stationIds.push(sl.Station_Id);
    });

    this.stationIds.forEach(s=>{
      this.stationsToDraw.push(this.stations.find(x=>x.Id==s));
    });
  }

  private checkConnection(){
    this.notifService.startConnection().subscribe(e => {this.isConnected = e; 
        if (e) {
          this.notifService.StartTimer();

        }
    });
  }

  private subscribeForNotifications () {
    this.notifService.notificationReceived.subscribe(e => this.onNotification(e));
  }

  public onNotification(notif: string) {

     this.ngZone.run(() => { 
       this.notifications.push(notif);  
       console.log(this.notifications);
    });  
  }

  subscribeForTime() {
    this.notifService.registerForTimerEvents().subscribe(e => this.onTimeEvent(e));
  }

  public onTimeEvent(time: string){

    this.ngZone.run(() => { 
       this.time = time;
      //   this.polyline.path = [];
      //  this.markerInfo = new MarkerInfo(new GeoLocation(this.stationsToDraw[this.num].CoordinateX,this.stationsToDraw[this.num].CoordinateY),
      //  "assets/bg.png",
      //  "Jugodrvo", "", "http://ftn.uns.ac.rs/691618389/fakultet-tehnickih-nauka");
      //  this.polyline.addLocation(new GeoLocation(this.stationsToDraw[this.num].CoordinateX,this.stationsToDraw[this.num].CoordinateY));
      
      this.latMarker = this.stationsToDraw[this.num].CoordinateX;
      this.longMarker = this.stationsToDraw[this.num].CoordinateY;

      //this.geoLocations[this.num] = new GeoLocation(this.stationsToDraw[this.num].CoordinateX,this.stationsToDraw[this.num].CoordinateY);
       this.num = this.num + 1;
      if(this.num>this.stationsToDraw.length -1)
        this.num = 0;
        
    });  
    console.log(this.time);
  }

  public onClick() {
    if (this.isConnected) {
      this.http.click().subscribe(data => {

      });
    }
  } 

  public startTimer() {
    this.notifService.StartTimer();
  }

  public stopTimer() {
    this.notifService.StopTimer();
    this.time = "";
  }

}
