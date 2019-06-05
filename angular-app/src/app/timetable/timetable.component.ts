import { Component, OnInit } from '@angular/core';
import { ServerService } from '../services/server.service';
import {Router, ActivatedRoute} from '@angular/router';
import { LineToLineMappedSource } from 'webpack-sources';

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.css']
})
export class TimetableComponent implements OnInit {

  constructor(private serverService: ServerService, private route: ActivatedRoute, private router: Router) { }

  cityLines: Array<string> = []; //imena gradskih linija 
  suburbanLines: Array<string> = []; //imena prigradskih linija
  lines: Array<any> = []; //sve linije iz baze
  timeTable: Array<any> = []; //svi redovi voznje iz baze
  showDivCityLines : boolean;
  showDivSuburbanLines : boolean;
  radioSelected:string;
  radioSelectedString:string;
  radioSel:any;
  line : any;
  time : any;
  radioSelectedDay:string;
  radioSelDay:string;
  days:Array<string> = ["Weekday","Saturday","Sunday"];
  showDivDay:boolean;
  showdivTimes:boolean;

  ngOnInit() {

    this.callGetLines(); 
    this.callGetTimeTable();
   
  }

  callGetLines(){
    this.serverService.getLines()
      .subscribe(
        data => {
          this.lines = data;        
        },
        error => {
          console.log(error);
        }
      )
  }

  callGetTimeTable(){
    this.serverService.getTimeTable()
      .subscribe(
        data => {
          this.timeTable = data;           
          this.timeTable.forEach( x => {
            if(x.Type == "Gradski"){
              var nameLine = this.lines.find(line => line.Id === x.Line_Id).Name;
              var directionLine = this.lines.find(line => line.Id === x.Line_Id).Direction;
              if(this.cityLines.indexOf(nameLine+directionLine)=== -1){
                this.cityLines.push(nameLine + directionLine);
              }

            }
            else if(x.Type == "Prigradski"){
              var nameLine = this.lines.find(line => line.Id === x.Line_Id).Name;
              var directionLine = this.lines.find(line => line.Id === x.Line_Id).Direction;
              if(this.suburbanLines.indexOf(nameLine+directionLine) === -1){
                this.suburbanLines.push(nameLine + directionLine);
              }
            }
          });     
        },
        error => {
          console.log(error);
        }
      )
  }

  onCheckedCityLines(){
    this.showDivCityLines = true;
    this.showDivSuburbanLines = false;
    this.showDivDay = true;
    this.showdivTimes = false;
  }

  onCheckedSuburbanLines(){
    this.showDivCityLines = false;
    this.showDivSuburbanLines = true;   
    this.showDivDay = true;
    this.showdivTimes = false;
  }

  onItemChange3(){

    this.radioSelDay = this.days.find(Item => Item === this.radioSelectedDay);
    
  }

  onItemChange1(line){
    this.radioSel = this.cityLines.find(Item => Item === this.radioSelected);
    var lineName = line.substring(0, this.radioSel.length-1);
    var line_ID = this.lines.find(Line => Line.Name == lineName).Id;
    var times = this.timeTable.find(TT=>TT.Line_Id===line_ID && TT.Day===this.radioSelDay).Times;
    this.showdivTimes = true; 
    this.radioSelectedString = times;
  }

  onItemChange2(line){
    this.radioSel = this.suburbanLines.find(Item => Item === this.radioSelected);
    var lineName = line.substring(0, this.radioSel.length-1);
    var line_ID = this.lines.find(Line => Line.Name == lineName).Id;
    var times = this.timeTable.find(TT=>TT.Line_Id===line_ID && TT.Day===this.radioSelDay).Times;
    this.showdivTimes = true; 
    this.radioSelectedString = times;
  }

}
