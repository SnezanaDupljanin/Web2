import { Component, OnInit, Input, NgZone } from '@angular/core';
import { MarkerInfo } from './model/marker-info.model';
import { GeoLocation } from './model/geolocation';
import { Polyline } from './model/polyline';
import { ServerService } from '../services/server.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  styles: ['agm-map {height: 500px; width: 1000px;}'], //postavljamo sirinu i visinu mape
  providers: [ServerService]
})
export class MapComponent {

  markerInfo: MarkerInfo;
  public polyline: Polyline;
  public zoom: number;

  constructor(private ngZone: NgZone, private serverService: ServerService) {
    this.markerInfo = new MarkerInfo(new GeoLocation(45.242268, 19.842954),
      "assets/ftn.png",
      "Jugodrvo", "", "http://ftn.uns.ac.rs/691618389/fakultet-tehnickih-nauka");

    this.polyline = new Polyline([], 'blue', { url: "assets/busicon.png", scaledSize: { width: 50, height: 50 } });

  }
  myFunc() {
    /*this.serverService.addLine(this.polyline)
      .subscribe(
        data => {

        },
        error => {
          console.log(error);
          for (var key in error.error.ModelState) {
            for (var i = 0; i < error.error.ModelState[key].length; i++) {
              //this.errors.push(error.error.ModelState[key][i]);
            }
          }
        })*/
    }

  placeMarker($event) {
    this.polyline.addLocation(new GeoLocation($event.coords.lat, $event.coords.lng))
    console.log(this.polyline)
  }

}
