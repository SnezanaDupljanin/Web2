import { Component, OnInit } from '@angular/core';
import { ServerService } from '../services/server.service';
import {Router, ActivatedRoute} from '@angular/router';
import { NgForm } from '@angular/forms';
import { Price } from '../models/price.model';
import { PriceListItem } from '../models/priceListItem.model';
import { collectExternalReferences } from '@angular/compiler';

@Component({
  selector: 'app-price-list',
  templateUrl: './price-list.component.html',
  styleUrls: ['./price-list.component.css']
})
export class PriceListComponent implements OnInit {

  items: Array<any>;
  prices: Array<any>;
  coefficients: Array<any>;
  id_item: number;
  id_type: number;
  priceListItems: Array<any>;
  priceTemporal:number;
  priceDaily:number;
  priceMonthly:number;
  priceYearly:number;
  studentCoe:number;
  pensionerCoe:number;


  constructor(private serverService: ServerService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.callGetItems(); 
    this.callGetCoefficients(); 
    this.callGetPrices();
  }

  callGetItems(){
    this.serverService.getItems()
      .subscribe(
        data => {
          this.items = data;        
        },
        error => {
          console.log(error);
        }
      )
  }

  callGetPrices(){
    this.serverService.getPrices()
      .subscribe(
        data => {
          this.prices = data;

          this.priceTemporal = this.prices[0].Price;
          this.priceDaily = this.prices[1].Price;
          this.priceMonthly = this.prices[2].Price;
          this.priceYearly = this.prices[3].Price;
                    
        },
        error => {
          console.log(error);
        }
      )
  }

  callGetCoefficients()
  {
    this.serverService.getCoefficinets()
      .subscribe(
        data => {
          this.coefficients = data;
          this.studentCoe = this.coefficients[0].Value;
          this.pensionerCoe = this.coefficients[1].Value;
        },
        error => {
          console.log(error);
        }
      )
  }

  onCheckedRegularTemporal(){
    this.priceTemporal = this.prices[0].Price;
  }

  onCheckedStudentTemporal(){
    this.priceTemporal = this.prices[0].Price * this.studentCoe;
  }

  onCheckedPensionerTemporal(){
    this.priceTemporal = this.prices[0].Price * this.pensionerCoe;
  }

  onCheckedRegularDaily(){
    this.priceDaily = this.prices[1].Price;
  }

  onCheckedStudentDaily(){
    this.priceDaily = this.prices[1].Price * this.studentCoe;
  }

  onCheckedPensionerDaily(){
    this.priceDaily = this.prices[1].Price * this.pensionerCoe;
  }

  onCheckedRegularMonthly(){
    this.priceMonthly= this.prices[2].Price;
  }

  onCheckedStudentMonthly(){
    this.priceMonthly = this.prices[2].Price * this.studentCoe;
  }

  onCheckedPensionerMonthly(){
    this.priceMonthly = this.prices[2].Price * this.pensionerCoe;
  }

  onCheckedRegularYearly(){
    this.priceYearly= this.prices[3].Price;
  }

  onCheckedStudentYearly(){
    this.priceYearly = this.prices[3].Price * this.studentCoe;
  }

  onCheckedPensionerYearly(){
    this.priceYearly = this.prices[3].Price * this.pensionerCoe;
  }

}
