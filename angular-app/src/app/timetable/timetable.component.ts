import { Component, OnInit } from '@angular/core';
import { ServerService } from '../services/server.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LineToLineMappedSource } from 'webpack-sources';
import { stringify } from '@angular/compiler/src/util';
import { TimeTable } from '../models/timeTable.model';

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.css']
})
export class TimetableComponent implements OnInit {

  constructor(private serverService: ServerService, private route: ActivatedRoute, private router: Router) { }

  subORcityLines: Array<string> = []; //imena gradskih linija 
  //suburbanLines: Array<string> = []; //imena prigradskih linija
  lines: Array<any> = []; //sve linije iz baze
  timeTable: Array<any> = []; //svi redovi voznje iz baze
  showDivCityLines: boolean;
  showDivSuburbanLines: boolean;
  radioSelected: string;
  radioSelectedString: string;
  radioSel: any;
  line: any;
  time: any;
  radioSelectedDay: string;
  radioSelDay: string;
  days: Array<string> = ["Weekday", "Saturday", "Sunday"];
  showDivDay: boolean;
  showdivTimes: boolean;
  TT: Array<any> = [];
  line_ID: number;
  selectedTime: string ="";
  showDivEditTime: boolean;
  newValueTT: any;
  s: string;
  new: string;
  modified: string;
  allowAdmin: boolean=false;
  city: boolean;
  suburban: boolean;
  id_TimeTable:number;

  


  ngOnInit() {

    this.callGetLines();
    this.callGetTimeTable();
    this.city = false;
    this.suburban = false;
    if (localStorage.role == "Admin") {
      this.allowAdmin = true;
    } else {
      this.allowAdmin = false;
    }

  }
  Delete() {
    this.getID();

    this.serverService.deleteTime(this.id_TimeTable)
      .subscribe(
        data => {
          // this.lines = data; 
          console.log('ok');
          
        },
        error => {
          console.log(error);
        }
      )
      this.router.navigate(['/TimeTable']).then(()=>window.location.reload());
  }
  Edit(t: string) {
    this.selectedTime = t;
    this.showDivEditTime = true;
  }
  Close() {
    this.showDivEditTime = false;
  }
  Edit2() {
    this.s = this.selectedTime;
    this.new = this.newValueTT;
    this.modified = this.radioSelectedString.replace(this.s, this.new);
    this.TT = this.modified.split(';');

    this.getID();
    var TimeTableParM;
    this.timeTable.forEach(x => {
      if(x.Id == this.id_TimeTable)
      {
        TimeTableParM=x;
      }
    });
    TimeTableParM.Times = this.modified;
    this.serverService.putTimeTable(this.id_TimeTable, TimeTableParM)
      .subscribe(
        data => {
          //this.lines = data; 
          console.log('ok');
        },
        error => {
          console.log(error);
        }
      )
  }
  getID()
  {
    this.timeTable.forEach(x => {
      if(x.Line_Id == this.line_ID && x.Day == this.radioSelectedDay)
      {
        this.id_TimeTable = x.Id;
      }
    });
  }
  callGetLines() {
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

  callGetTimeTable() {
    this.serverService.getTimeTable()
      .subscribe(
        data => {
          this.timeTable = data;
        },
        error => {
          console.log(error);
        }
      )
  }

  onCheckedCityLines() {
    this.showDivDay = true;
    this.showdivTimes = false;
    this.city = true;
    this.suburban = false;
  }

  onCheckedSuburbanLines() {
    this.showDivDay = true;
    this.showdivTimes = false;
    this.suburban = true;
    this.city = false;
  }

  onItemChange3() {
    this.showdivTimes=false;
    this.showDivCityLines = false;
    this.showDivSuburbanLines = false;
    this.subORcityLines = [];

    this.radioSelDay = this.days.find(Item => Item === this.radioSelectedDay);
    if (this.city == true) {
      if (this.radioSelDay == "Weekday") {        
        this.FindLineToShow("Gradski", "Weekday");
      }
      if (this.radioSelDay == "Saturday") {
        this.FindLineToShow("Gradski", "Saturday");
      }
      if (this.radioSelDay == "Sunday") {
        this.FindLineToShow("Gradski", "Sunday");
      }      
    }
    else if (this.suburban == true) {
      if (this.radioSelDay == "Weekday") {
        this.FindLineToShow("Prigradski", "Weekday");
      }
      if (this.radioSelDay == "Saturday") {
        this.FindLineToShow("Prigradski", "Saturday");
      }
      if (this.radioSelDay == "Sunday") {
        this.FindLineToShow("Prigradski", "Sunday");
      }

    }

  }
  FindLineToShow(type: string, day: string) {
    this.timeTable.forEach(x => {
      if (x.Type == type && x.Day == day) {
        var nameLine = this.lines.find(line => line.Id === x.Line_Id).Name;
        var directionLine = this.lines.find(line => line.Id === x.Line_Id).Direction;
        var a = nameLine + directionLine;
        if (this.subORcityLines.indexOf(a) == -1) {
          this.subORcityLines.push(nameLine + directionLine);
        }
      }
    });
    if(type =="Gradski")
    {
      this.showDivCityLines = true;
      this.showDivSuburbanLines = false;
    }
    else{
      this.showDivCityLines = false;
      this.showDivSuburbanLines = true;
    }
  }
  onItemChange1(line) {
    this.radioSel = this.subORcityLines.find(Item => Item === this.radioSelected);
    var lineName = line.substring(0, this.radioSel.length - 1);
    var dir = line.substring(this.radioSel.length - 1);
    this.line_ID = this.lines.find(Line => Line.Name == lineName && Line.Direction == dir).Id;
    var times = this.timeTable.find(TT => TT.Line_Id === this.line_ID && TT.Day === this.radioSelDay).Times;
    this.showdivTimes = true;
    this.radioSelectedString = times;
    this.TT = this.radioSelectedString.split(';');
  }

  onItemChange2(line) {
    this.radioSel = this.subORcityLines.find(Item => Item === this.radioSelected);
    var lineName = line.substring(0, this.radioSel.length - 1);
    var line_ID = this.lines.find(Line => Line.Name == lineName).Id;
    var times = this.timeTable.find(TT => TT.Line_Id === line_ID && TT.Day === this.radioSelDay).Times;
    this.showdivTimes = true;
    this.radioSelectedString = times;
  }

}
