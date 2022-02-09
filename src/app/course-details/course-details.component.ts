import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { icon, latLng, marker, tileLayer } from 'leaflet';
import * as L from "leaflet";
import { CourseService } from 'src/_services/course.service';
import { UserService } from 'src/_services/user.service';
import { TokenStorageService } from 'src/_services/token-storage.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Comment} from '../../models/comment';
import { FeedService } from 'src/_services/feed.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css']
})
export class CourseDetailsComponent implements OnInit {

  baseLayer = tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
    })
  layersControl = {};
  public iconUrl: any = '../../../assets/marker.svg';
  course:any;
  public courseName: string;
  public courseMarker:any;
  public userCourses:any;
  public currentUser: any;
  public user: any;
  public dialogRef:any;
  public createCommentForm : FormGroup;
  constructor(private courseService:CourseService,
              private route:ActivatedRoute,
              private userService: UserService,
              private tokenStorageService: TokenStorageService,
              private toastr:ToastrService,
              private _location: Location,
              private fb: FormBuilder,
              private feedService: FeedService,
              private translate: TranslateService,
              private dialog:MatDialog) {
                this.createCommentForm = fb.group({
                  commentContent : [null, Validators.required]
                })
              }

  ngOnInit(): void {
    this.courseName = this.route.snapshot.paramMap.get("name");
    this.currentUser = this.tokenStorageService.getUser();
    this.getUser();
    this.getCourse();

  }
  getUser(){
    this.userService.getUserById(this.currentUser.id).subscribe(data => {
      this.user=data;
      this.userCourses=this.user.courses;
      this.getCourse();
    })
  }
  public goBack(): void {
    this._location.back();
}

  createCommentContent: string;
  createComment(value){
    let newComment: Comment = new Comment();
    newComment.userId  = this.currentUser.username;
    newComment.content = value.commentContent;
    console.log(this.course.comments);
    
    if(typeof(this.course.comments)=="undefined"){
      this.course.comments = [];
    }
    this.course.comments.push(newComment);
    console.log(typeof(this.course.comments));
    this.courseService.editCourse(this.course).subscribe(data => {
      this.createCommentForm.reset();
      //this.reloadFeed();
    })
  }

  getCourse(){
    this.courseService.getCourseByName(this.courseName).subscribe(data=>{
      this.course=data;
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
      // };
    })
  }
  joinCourse(courseName){
    this.userService.joinCourse(this.user.username,courseName).subscribe(()=>{
      this.toastr.success(this.translate.instant("Course-joined-successfully!"))
      this.getUser();
      this.feedService.addNewPOst("Une jam tashme pjese e ketij kursi:"+courseName).subscribe(data=>{
        console.log(data);
        
      })
    },err=>{
      this.toastr.error(err);
    })
  }
   // ---------------LEAVE COURSE---------------//
   leaveCourseDialog(element, templateRef){
    this.courseName = element;
    this.dialogRef = this.dialog.open(templateRef);
  }
  leaveCourse(courseName){
    this.userService.leaveCourse(this.user.username,courseName).subscribe(()=>{
      this.toastr.success(this.translate.instant("Course-left-successfully!"))
      this.getUser();
    },err=>{
      this.toastr.error(err);
    })
  }
}
