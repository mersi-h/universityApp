import { HttpParams } from '@angular/common/http';
import { ChangeDetectorRef, Component, Directive, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
// import { latLng, tileLayer } from 'leaflet';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { Feed } from 'src/models/feed';
import { User } from 'src/models/user';
import { CourseService } from 'src/_services/course.service';
import { EventService } from 'src/_services/event.service';
import { FeedService } from 'src/_services/feed.service';
import { TokenStorageService } from 'src/_services/token-storage.service';
import { UserService } from 'src/_services/user.service';
import { WebSocketAPI } from '../webSocket/WebSocketApi';
@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {
  isLoggedIn = false;
  username: string;
  user: any;
  currentUser: any;
  role:any;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('addCourseDialog') addCourseDialog: TemplateRef<any>;
  displayedColumns = ['position','name','description','universityName', 'date', 'location','actions'];
  dataSource = new MatTableDataSource();
  public page=0;
  public size=10;
  length:any;
  change:boolean=false;
  courses: any;
  dialogRef:any;
  universities:any;
  minDate: Date;
  courseToBeDeleted:any;
  courseName:any;
  userCourses:any;
  courseToBeEdited:any;
  myNotifications:any;
  nrOfNotifications:any;
  public createForm: FormGroup;

  constructor(private tokenStorageService:TokenStorageService,
              private userService:UserService,
              private router:Router,
              private fb: FormBuilder,
              private courseService:CourseService,
              private toastr: ToastrService,
              private eventService: EventService,
              private dialog:MatDialog,
              private feedService: FeedService,
              private translate: TranslateService) {

      this.minDate = new Date();
      this.createForm=fb.group({
      id: [null],
      name: [null, Validators.required],
      universityName: [null, Validators.required],
      description: [null, Validators.required],
      location: [null, Validators.required],
      date: [null, Validators.required],
      latitude: [null, Validators.required],
      longitude: [null, Validators.required],
      users: [null]
    })
              }
  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      this.currentUser = this.tokenStorageService.getUser();
      this.role=this.currentUser.roles[0];
      this.getUniversities();
      this.getUser();
    }
    else
      this.router.navigate(['/login']);
  }
  getUser(){
    this.userService.getUserById(this.currentUser.id).subscribe(data => {
      this.user=data;
      this.userCourses=this.user.courses;
      this.getCourses();
    })
  }
  getRequestParams(page, pageSize): any {
    let params = new HttpParams()
            .set('page', String(page))
            .append('size', String(pageSize))
    return params;
  }

  getUniversities(){
    this.courseService.getAllUniversities().subscribe(data=>{
      this.universities=data;
    })
  }
  getCourses(){
    const params=this.getRequestParams(this.page,this.size);
    this.courseService.getAllCourses(params).subscribe(data=>{
      this.courses=data.content;
      this.dataSource = new MatTableDataSource(this.courses);
      this.dataSource.sort=this.sort;
      this.length=data.totalElements;
    })
  }
  handlePage(event:PageEvent){
    this.page=event.pageIndex;
    this.size=event.pageSize;
    this.getCourses();
  }
  search(value:string){
    let params=new HttpParams()
            .set('page', String(this.page))
            .append('size', String(this.size))
            .append('name', value)

    this.courseService.getAllCourses(params).subscribe(data=>{
      this.courses=data.content;
      this.dataSource = new MatTableDataSource(this.courses);
      this.dataSource.sort=this.sort;
      this.length=data.totalElements;
    })
  }
  // --------------ADD COURSE DIALOG -------------//
  addCourse(){
    this.createForm.reset();
    this.dialogRef = this.dialog.open(this.addCourseDialog, {
      width: '600px',
      height: '500px'
    });
  }
  createCourse(form){
    if(form.valid){
      let formValue=form.value;
      this.courseService.addCourse(formValue).subscribe(data=>{
        console.log(data);
        this.closeDialog();
        this.toastr.success(this.translate.instant("Course-added-successfully!"));
        this.getCourses();
      },
      err=>{
        this.toastr.error(err.error.message);
      })
    }
    else{
    this.toastr.error(this.translate.instant("Please-fill-out-all-the-required-fields!"))
    }
  }
  // ---------------DELETE COURSE---------------//
  deleteCourseDialog(element, templateRef) {
    this.courseToBeDeleted = element;
    this.dialogRef = this.dialog.open(templateRef);
  }
  deleteCourse(courseNameToBeDeleted){
    this.courseService.deleteCourse(courseNameToBeDeleted).subscribe(()=>{
      this.toastr.success(this.translate.instant("Course-deleted-successfully!"));
      this.getCourses();
    }
    ,err=>{
      this.toastr.error(err.error.message);
    })
  }
    // ---------------JOIN COURSE---------------//
  joinCourse(courseName){
    this.userService.joinCourse(this.user.username,courseName).subscribe(()=>{
      this.toastr.success(this.translate.instant("Course-joined-successfully!"))
      this.getUser();
      let newPost : Feed = new Feed();
      newPost.content = "Une jam tashme pjese e ketij kursi:"+courseName;
      newPost.userId  = this.currentUser.username;
      this.feedService.addNewPOst(newPost).subscribe(data=>{
        console.log(data);

      })
          this.checkNotification(courseName);
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
  // ---------------EDIT COURSE---------------//
  editCourseDialog(element, templateRef){
    this.createForm.patchValue(element);
    this.dialogRef = this.dialog.open(templateRef);
  }
  editCourse(form){
    if(form.valid){
      this.courseService.editCourse(form.value).subscribe(()=>{
        this.toastr.success(this.translate.instant("Course-edited-successfully!"));
        this.closeDialog();
        this.getCourses();
      },err=>{
        this.toastr.error(err.error);
      })
    }
  }
  closeDialog(){
    if (this.dialogRef != null) {
      this.dialogRef.close();
  }
  }
  courseDetails(name){
    this.router.navigate(['/course/',name]);
  }
  calculateDiff(dateSent){
    let currentDate = new Date();
    dateSent = new Date(dateSent);
    return Math.floor((Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate())-Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())) /(1000 * 60 * 60));
  }
  checkNotification(courseName){
    let emittableNotification;
    this.courseService.getCourseByName(courseName).subscribe(data=>{

      this.eventService.notificationAudit(data);
    })

  }
}
