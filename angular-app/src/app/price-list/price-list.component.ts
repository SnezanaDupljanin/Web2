import { Component, OnInit } from '@angular/core';
import { ServerService } from '../services/server.service';
import {Router, ActivatedRoute} from '@angular/router';
import { NgForm } from '@angular/forms';
import { Price } from '../models/price.model';
import { PriceListItem } from '../models/priceListItem.model';
import { collectExternalReferences } from '@angular/compiler';
import { AppUser } from '../models/appUser.model';
import { Ticket } from '../models/ticket.model';

@Component({
  selector: 'app-price-list',
  templateUrl: './price-list.component.html',
  styleUrls: ['./price-list.component.css']
})

export class PriceListComponent implements OnInit {

  items: Array<any>;
  prices: Array<any>;
  coefficients: Array<any>;
  buyTickets: Array<any>;
  id_item: number;
  id_type: number;
  priceListItems: Array<any>;
  priceTemporal:number;
  priceDaily:number;
  priceMonthly:number;
  priceYearly:number;
  studentCoe:number;
  pensionerCoe:number;
  showButton:boolean;
  user: AppUser;
  ticket : Ticket;
  showTicketList:Array<any>=[];
  showDivList:boolean;
  showButtonAdmin:boolean;
  showEditT:boolean;
  showEditD:boolean;
  showEditM:boolean;
  showEditY:boolean;
  newValue:any;
  new:number;
  priceLItem:PriceListItem=new PriceListItem();
  Id_PLI:number;

  constructor(private serverService: ServerService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.callGetItems(); 
    this.callGetCoefficients(); 
    this.callGetPrices();

    if(localStorage.jwt)
      this.getUserDetails();

    if(localStorage.role ==="AppUser"){
      this.showButton = true;
    }else{
      this.showButton = false;
    }
    if(localStorage.role === "Admin")    {
      this.showButtonAdmin = true;
    }
    else{
      this.showButtonAdmin = false;
    }
  }
  showBuyTicket()
  {
    this.showTicketList=[];
    this.getBuyT();
  }
  getBuyT() : any{
    this.serverService.getBuyTickets()
    .subscribe(
      data => {
        this.buyTickets = data; 
        var i = this.user.Email.split('@')[0];
        this.buyTickets.forEach(x=>{
          if(x.User_Id == i){
            this.showTicketList.push(x);
          }
        });
        this.showDivList=true;
      },
      err => {
        console.log(err);
      }
    )
  }
  getUserDetails() : any {
    this.serverService.getUserDetails()
    .subscribe(
      data => {
        this.user = data;       
      },
      err => {
        console.log(err);
      }
    )
  }

  isDisabledStudent(){
    if(localStorage.role=='AppUser'){
      if(this.user.Type == 'Student' && this.user.Active==true){
        return false;
      }else{
        return true;
      }
    }else{
      return false;
    }
    
  }

  isDisabledPensioner(){
    if(localStorage.role=='AppUser'){
      if(this.user.Type == 'Pensioner' && this.user.Active==true){
        return false;
      }else{
        return true;
      }
    }else{
      return false;
    }
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

  buttonBuyTemporal(){
    this.ticket = new Ticket();
    this.ticket.TicketType = "Temporal";
    var id = this.user.Email.split('@')[0];
    this.ticket.User_Id = id;
    this.ticket.Valid = true;

    this.serverService.postTicket(this.ticket)
    .subscribe(
      data => {
        console.log("Kupljena karta!!");              
      },
      error => {
        console.log(error);
      }
    )
  }

  buttonBuyDaily(){
    this.ticket = new Ticket();
    this.ticket.TicketType = "Daily";
    var id = this.user.Email.split('@')[0];
    this.ticket.User_Id = id;
    this.ticket.Valid = true;

    this.serverService.postTicket(this.ticket)
    .subscribe(
      data => {
        console.log("Kupljena karta!!");              
      },
      error => {
        console.log(error);
      }
    )
  }

  buttonBuyMonthly(){
    this.ticket = new Ticket();
    this.ticket.TicketType = "Monthly";
    var id = this.user.Email.split('@')[0];
    this.ticket.User_Id = id;
    this.ticket.Valid = true;

    this.serverService.postTicket(this.ticket)
    .subscribe(
      data => {
        console.log("Kupljena karta!!");              
      },
      error => {
        console.log(error);
      }
    )
  }

  buttonBuyYearly(){
    this.ticket = new Ticket();
    this.ticket.TicketType = "Yearly";
    var id = this.user.Email.split('@')[0];
    this.ticket.User_Id = id;
    this.ticket.Valid = true;

    this.serverService.postTicket(this.ticket)
    .subscribe(
      data => {
        console.log("Kupljena karta!!");              
      },
      error => {
        console.log(error);
      }
    )
  }
  buttonEditTemporal(){
    this.showEditT=true;
  }
  buttonEditDaily(){
    this.showEditD=true;
  }
  buttonEditMonthly(){
    this.showEditM=true;
  }
  buttonEditYearly(){
    this.showEditY=true;
  }
  CloseD(){
    this.showEditD=false;
  }
  CloseT(){
    this.showEditT=false;
  }
  CloseM(){
    this.showEditM=false;
  }
  CloseY(){
    this.showEditY=false;
  }
  EditT(a){
    this.prices.forEach(x=>{
      if(x.Item_Id == 1 && x.PriceList_Id==1 && x.Price==this.priceTemporal)
      {
        this.Id_PLI = x.Id;
      }
    });
    this.new = a;
    this.priceTemporal =this.new;
    this.priceLItem.item_Id = 1;
    this.priceLItem.priceList_Id=1;
    this.priceLItem.price= this.priceTemporal;
    this.priceLItem.id = this.Id_PLI;
    this.serverService.putTicket(this.Id_PLI,this.priceLItem)
    .subscribe(
      data => {
        console.log("Editovana!!");              
      },
      error => {
        console.log(error);
      }
    )
  }
  EditD(a){
    this.prices.forEach(x=>{
      if(x.Item_Id == 2 && x.PriceList_Id==1 && x.Price==this.priceDaily)
      {
        this.Id_PLI = x.Id;
      }
    });
    this.new = a;
    this.priceDaily =this.new;
    this.priceLItem.item_Id = 2;
    this.priceLItem.priceList_Id=1;
    this.priceLItem.price= this.priceDaily;
    this.priceLItem.id = this.Id_PLI;
    this.serverService.putTicket(this.Id_PLI,this.priceLItem)
    .subscribe(
      data => {
        console.log("Editovana!!");              
      },
      error => {
        console.log(error);
      }
    )
  }
  EditM(a){
    this.prices.forEach(x=>{
      if(x.Item_Id == 3 && x.PriceList_Id==1 && x.Price==this.priceMonthly)
      {
        this.Id_PLI = x.Id;
      }
    });
    this.new = a;
    this.priceMonthly =this.new;
    this.priceLItem.item_Id = 3;
    this.priceLItem.priceList_Id=1;
    this.priceLItem.price= this.priceMonthly;
    this.priceLItem.id = this.Id_PLI;
    this.serverService.putTicket(this.Id_PLI,this.priceLItem)
    .subscribe(
      data => {
        console.log("Editovana!!");              
      },
      error => {
        console.log(error);
      }
    )
  }
  EditY(a){
    this.prices.forEach(x=>{
      if(x.Item_Id == 4 && x.PriceList_Id==1 && x.Price==this.priceYearly)
      {
        this.Id_PLI = x.Id;
      }
    });
    this.new = a;
    this.priceYearly =this.new;
    this.priceLItem.item_Id = 4;
    this.priceLItem.priceList_Id=1;
    this.priceLItem.price= this.priceYearly;
    this.priceLItem.id = this.Id_PLI;
    this.serverService.putTicket(this.Id_PLI,this.priceLItem)
    .subscribe(
      data => {
        console.log("Editovana!!");              
      },
      error => {
        console.log(error);
      }
    )
  }
}
