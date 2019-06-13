import { Component, OnInit, Input, NgZone } from '@angular/core';
import { MarkerInfo } from './model/marker-info.model';
import { GeoLocation } from './model/geolocation';
import { Polyline } from './model/polyline';
import { ServerService } from '../services/server.service';
import { MapsAPILoader } from '@agm/core';
import { ModalService } from '../services/modal.service';
import { Station } from '../models/station.model';
import { Line } from '../models/line.model';
import { StationLine } from '../models/stationLine.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  styles: ['agm-map {height: 500px; width: 1000px;}','app/map/modal.less'], //postavljamo sirinu i visinu mape
  providers: [ServerService]
})

export class MapComponent {

  lineNames: Array<string> = [];
  lines: Array<any> = []; //sve linije iz baze
  stations: Array<any>=[]; //sve stanice iz baze
  radioSelected:string; //selektovana linija
  radioSel:string; //selektovana linija
  line1 : any;
  line_ID:number;
  stationLines:Array<any> = []; 
  stationIds : Array<number>=[];
  stationsToDraw:Array<Station> = [];
  showEditLine:boolean;
  showEditStation:boolean;
  markerInfo: MarkerInfo;
  public polyline: Polyline;
  public zoom: number;
  private geoCoder;
  latitude: number;
  longitude: number;
  address: string;
  bodyText: string;
  bodyText1: string = "";
  bodyText2: string = "";
  locationStation : GeoLocation;
  station : Station;
  line: Line;
  lineId:number;
  stationId:number;
  stationLine:StationLine;
  lineEdit:Line;
  stationEdit:Station = new Station();
  stationEdit_ID : number;
  showAdminDiv : boolean;
  private map;
  stationNameErr:string;
  lineNameErr:string;
  directionErr:string;

  constructor(private ngZone: NgZone, private serverService: ServerService, private mapsAPILoader: MapsAPILoader, private modalService: ModalService) {

    this.markerInfo = new MarkerInfo(new GeoLocation(45.242268, 19.842954),
      "assets/ftn.png",
      "Jugodrvo", "", "http://ftn.uns.ac.rs/691618389/fakultet-tehnickih-nauka");

    this.polyline = new Polyline([], 'blue', { url: "assets/busicon.png", scaledSize: { width: 50, height: 50 } });
  }

  ngOnInit() {
    this.bodyText = '';
    if(localStorage.role=="Admin"){
      this.showAdminDiv = true;
    }else{
      this.showAdminDiv = false;

    }
    this.callGetLines();
    this.callGetStations();
    this.callGetStationLine();

    this.mapsAPILoader.load().then(() => {

      this.geoCoder = new google.maps.Geocoder;
     // this.getAddress(45.242268, 19.842954); //proba

    });
  }

  placeMarker($event) {

    if(this.showAdminDiv){
    this.openModal('custom-modal-1');
    this.getAddress($event.coords.lat, $event.coords.lng);
    this.locationStation = new GeoLocation($event.coords.lat, $event.coords.lng);
    this.markerInfo = new MarkerInfo(new GeoLocation($event.coords.lat, $event.coords.lng),
      "assets/bg.png",
      "Jugodrvo", "", "http://ftn.uns.ac.rs/691618389/fakultet-tehnickih-nauka");
    console.log(this.polyline)
  }
  }

  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      console.log(results);
      console.log(status);
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.address = results[0].formatted_address;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    });
  }

  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }
 

  createStation(){

    if(this.bodyText!="" && this.bodyText.length>4){
      this.polyline.addLocation(this.locationStation);  
      this.station = new Station();
      this.stationLine = new StationLine();
      this.station.Name = this.bodyText;
      this.station.Address = this.address;
      this.station.CoordinateX = this.locationStation.latitude;
      this.station.CoordinateY = this.locationStation.longitude;
      this.modalService.close('custom-modal-1');
      this.bodyText = '';
      this.callPostStation();
      //this.callPostStationLine();
    }else{
      this.stationNameErr = "Name of station cannot be empty and must countans 4 letters."
    }
  }

  callPostStation(){
    this.station.Address = this.address;
    this.serverService.postStation(this.station)
        .subscribe(
          data =>{
            this.stationId = data.Id;
            this.callPostStationLine();
           console.log("Poslata stanica.");
          },
          error => {
            console.log(error);
          }
        )
  }

  callPostLine(){
    this.serverService.postLine(this.line)
        .subscribe(
          data =>{
            this.lineId = data.Id;
           console.log("Poslata linija.");
          },
          error => {
            console.log(error);
          }
        )
  }

  callPostStationLine(){
    
    this.stationLine.Line_Id = this.lineId;
    this.stationLine.Station_Id = this.stationId;
    this.serverService.postStationLine(this.stationLine)
        .subscribe(
          data =>{
           console.log("Poslata stationline.");
          },
          error => {
            console.log(error);
          }
        )
  }

  createLine(){

    if(this.bodyText1!="" && (this.bodyText2=="A" || this.bodyText2=="B")){
      this.polyline.path = [];
      this.stationIds = [];
      this.stationsToDraw = [];
      this.line = new Line();
      this.line.Name = this.bodyText1;
      this.line.Direction = this.bodyText2;
      this.modalService.close('custom-modal-2');
      this.bodyText1 = '';
      this.bodyText2 = '';
      this.callPostLine();
    }else if(this.bodyText1=="" && this.bodyText2!="A" && this.bodyText2!="B"){
      this.lineNameErr = "Name of line cannot be empty.";
      this.directionErr = "Direction must be only 'A' or 'B'";
    }
     else if(this.bodyText1==""){
      this.lineNameErr = "Name of line cannot be empty.";
    } else if(this.bodyText2!="A" && this.bodyText2!="B"){
      this.directionErr = "Direction must be only 'A' or 'B'";
    }

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
    this.polyline.path = [];
    this.stationIds = [];
    this.stationsToDraw = [];
    this.radioSel = this.lineNames.find(Item => Item === this.radioSelected);
    var lineName = line.substring(0, this.radioSel.length-1);
    var direction = line.substring(this.radioSel.length-1);
    this.line_ID = this.lines.find(Line => Line.Name == lineName && Line.Direction==direction).Id;

    this.lineEdit = this.lines.find(Line => Line.Name == lineName && Line.Direction==direction);

    this.stationLines.forEach(sl=>{
      if(sl.Line_Id==this.line_ID)
        this.stationIds.push(sl.Station_Id);
    });

    this.stationIds.forEach(s=>{
      this.stationsToDraw.push(this.stations.find(x=>x.Id==s));
    });

    this.stationsToDraw.forEach(s=>{
      this.polyline.addLocation(new GeoLocation(s.CoordinateX,s.CoordinateY));
    });
  }

  editLine(){
    this.showEditLine = true;
  }

  UpdateLine()
  {
    this.serverService.putLine(this.line_ID, this.lineEdit)
    .subscribe(
      data => {
        //this.stations = data;        
      },
      error => {
        console.log(error);
      }
    )
  }

  UpdateStation()
  {
    this.serverService.putStation(this.stationEdit_ID, this.stationEdit)
    .subscribe(
      data => {
        //this.stations = data;        
      },
      error => {
        console.log(error);
      }
    )
  }

  clickedMarker(point) {
   this.stations.forEach(x=>{
     if(x.CoordinateX==point.latitude && x.CoordinateY==point.longitude){
       this.stationEdit = x; 
       this.stationEdit_ID = x.Id;    
     }
   });
   this.showEditStation = true;
  }

  deleteLine(){
    this.serverService.deleteLine(this.line_ID)
    .subscribe(
      data => {
        console.log("OK");     
      },
      error => {
        console.log(error);
      }
    )
  }

  deleteStation(){
    this.serverService.deleteStation(this.stationEdit_ID)
    .subscribe(
      data => {
        console.log("OK");     
      },
      error => {
        console.log(error);
      }
    )
  }
}
