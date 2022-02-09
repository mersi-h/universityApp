import { User } from './../../models/user';
import { ModalManager } from 'ngb-modal';
import {formatDate } from '@angular/common';
import { icon, latLng, marker, tileLayer } from 'leaflet';
import * as L from "leaflet";
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
  isToday,
} from 'date-fns';
import { Subject } from 'rxjs';

import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
  MOMENT,
} from 'angular-calendar';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CourseService } from 'src/_services/course.service';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/_services/user.service';
import { TokenStorageService } from 'src/_services/token-storage.service';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [];

  activeDayIsOpen: boolean = true;

  currentUser: User;
  userCourses: any[] =[];
  ngOnInit(){
   this.loadCoursesForUser();



  }

  loadCoursesForUser(){
    this.courseService.getCoursesByUser(this.currentUser.id).subscribe(
      data =>{
        this.userCourses = data;
        this.userCourses.forEach(element => {
          let endDate : Date = element.date//.setHours(element.date.getHours() +2);
          let newDate = new Date(element.date);
          console.log(element.name , "new date is ", newDate);
          newDate.setHours(newDate.getHours() + element.date.toLocaleTimeString().split(":")[0]);
          newDate.setMinutes(newDate.getMinutes()+ element.date.toLocaleTimeString().split(":")[1]);
          //console.log(typeof(dateString2Date(element.date)));
          let event : CalendarEvent = {
            start: element.date,
            end: newDate, //addDays(startOfDay(new Date(element.date)),1),
            title: element.name,
            color: colors.red,
            actions: this.actions,
            allDay: true,
            resizable: {
              beforeStart: true,
              afterEnd: true,
            },
            draggable: true,

          }
          this.events.push(event);
        });
        console.log(this.events);
      }
    )
  }

  public course : any;
  baseLayer = tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
  })
  layersControl = {};
  public iconUrl: any = '../../../assets/marker.svg';
  public courseName: string;
  public courseMarker:any;

  constructor(private tokenStorageService:TokenStorageService,
    private userService:UserService,
    private router:Router,
    private fb: FormBuilder,
    private courseService:CourseService,
    private toastr: ToastrService,
    private dialog:MatDialog,
    private modal: ModalManager){
      this.currentUser = this.tokenStorageService.getUser();
    }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.courseService.getCourseByName(event.title).subscribe(
      data=>{
        this.course = data;

        this.openDialog();

        console.log(data);
        let map = L.map('mapid').setView([ this.course.latitude,  this.course.longitude], 14);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        let icon: any;
         icon = L.icon({
            iconSize: [50, 41],
            iconAnchor: [13, 41],
            iconUrl: this.iconUrl,
            popupAnchor: [17, -30]
          });
        this.courseMarker = L.marker([ this.course.latitude, this.course.longitude ],{icon:icon}).addTo(map);
        this.courseMarker.bindPopup(this.course.name).openPopup();
      }
    )
  }

  openDialog() {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.width = "800px";
    dialogConfig.height = "600px";
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;

    this.dialog.open(this.modalContent, dialogConfig);
  }

  closeDialog(){
    this.dialog.closeAll();
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

}
function dateString2Date(date: any) {
  throw new Error('Function not implemented.');
}

