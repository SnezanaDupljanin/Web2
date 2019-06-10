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
  showDivCityLines : boolean;
  showDivSuburbanLines : boolean;
  radioSelected:string; //selektovana linija
  radioSel:string; //selektovana linija
  line1 : any;
  line_ID:number;
  stationLines:Array<any> = []; 
  stationIds : Array<number>=[];
  stationsToDraw:Array<Station> = [];

  markerInfo: MarkerInfo;
  public polyline: Polyline;
  public zoom: number;
  private geoCoder;
  latitude: number;
  longitude: number;
  address: string;
  bodyText: string;
  bodyText1: string;
  bodyText2: string;
  locationStation : GeoLocation;
  station : Station;
  line: Line;
  lineId:number;
  stationId:number;
  stationLine:StationLine;

  constructor(private ngZone: NgZone, private serverService: ServerService, private mapsAPILoader: MapsAPILoader, private modalService: ModalService) {

    this.markerInfo = new MarkerInfo(new GeoLocation(45.242268, 19.842954),
      "assets/ftn.png",
      "Jugodrvo", "", "http://ftn.uns.ac.rs/691618389/fakultet-tehnickih-nauka");

    this.polyline = new Polyline([], 'blue', { url: "assets/busicon.png", scaledSize: { width: 50, height: 50 } });
  }

  ngOnInit() {
    this.bodyText = '';
    this.callGetLines();
    this.callGetStations();
    this.callGetStationLine();

    this.mapsAPILoader.load().then(() => {

      this.geoCoder = new google.maps.Geocoder;
     // this.getAddress(45.242268, 19.842954); //proba

    });
  }

  placeMarker($event) {

    this.openModal('custom-modal-1');
    this.getAddress($event.coords.lat, $event.coords.lng);
    this.locationStation = new GeoLocation($event.coords.lat, $event.coords.lng);
    console.log(this.polyline)
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

    this.line = new Line();
    this.line.Name = this.bodyText1;
    this.line.Direction = this.bodyText2;
    this.modalService.close('custom-modal-2');
    this.bodyText1 = '';
    this.bodyText2 = '';
    this.callPostLine();
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
}
