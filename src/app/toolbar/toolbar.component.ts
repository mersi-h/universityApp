import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { SocketService } from 'src/_services/socket.service';
import { TokenStorageService } from 'src/_services/token-storage.service';
import { UserService } from 'src/_services/user.service';
import { FriendsComponent } from '../friends/friends.component';
import { WebSocketAPI } from '../webSocket/WebSocketApi';
import { TranslateService } from '@ngx-translate/core/';
import { fr } from 'date-fns/locale';
import { CourseService } from 'src/_services/course.service';
import { EventService } from 'src/_services/event.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit,AfterViewInit {

  isLoggedIn = false;
  currentUser: any;
  username: string;
  @Input() nrOfFriendRequests: any = 0;
  friendRequests: any;
  @Input() myFriendRequests: Array<any> = new Array<any>();
  nrOfNotifications : any = 0;
  myNotifications : Array<any> = new Array<any>();

  user: any;
  newFriendRequest: any;
  friendsComp: FriendsComponent
  data: any;
  subscribedCourse: any;
  constructor(public translate: TranslateService, private tokenStorageService: TokenStorageService,
    private userService: UserService,
    private courseService : CourseService,
    private eventService : EventService,
    private router: Router,
    private toastr: ToastrService,
    private socketService: SocketService) {
      this.eventService.notificationsChanges$.subscribe((course:any)=>{
        this.subscribedCourse = course;
        this.checkSubscribedCourse();
      })
    }

    checkSubscribedCourse(){
      if(this.subscribedCourse && this.myNotifications.indexOf(this.subscribedCourse) == -1){
        if(this.calculateDiff(this.subscribedCourse.date) <= 24 && this.calculateDiff(this.subscribedCourse.date) > 0 ){
          this.subscribedCourse.due = this.calculateDiff(this.subscribedCourse.date);
          this.myNotifications.push(this.subscribedCourse);
          this.nrOfNotifications++;
        }
      }
    }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      this.currentUser = this.tokenStorageService.getUser();
      this.username = this.currentUser.username;
      this.getUser();
      this.getCourseNotifications();
    }
    else
      this.router.navigate(['/login']);

  }
  ngAfterViewInit(): void{
    WebSocketAPI.friendReqSubject.subscribe((friendRequestBody) => {
      WebSocketAPI.status.subscribe(status => {
        this.currentUser = this.tokenStorageService.getUser();
        if (status == 'RECEIVED') {
          this.newFriendRequest = friendRequestBody;
          if (typeof this.newFriendRequest === 'object') {
            if (this.newFriendRequest.senderUsername == this.currentUser.username) {
              this.toastr.success( this.translate.instant("Friend-request-sent!") );
            }
            else if (this.newFriendRequest.receiverUsername == this.currentUser.username) {
              this.toastr.info( this.translate.instant("New-friend-request!") );
            }
          }
         this.getUser();
        }
        else if (status == 'ACCEPTED') {
          if (friendRequestBody.senderUsername == this.currentUser.username) {
            this.toastr.info(friendRequestBody.receiverUsername +  this.translate.instant("accepted-your-friend-request!") )
          }
          else if (friendRequestBody.receiverUsername == this.currentUser.username) {
            this.userService.getUserById(this.currentUser.id).subscribe(data => {
              this.user = data;
            })
            console.log(this.user.friendRequests);

            // this.getUser();
          }
        }
        else if (status == 'DECLINED') {
          if (friendRequestBody.senderUsername == this.currentUser.username) {
            this.toastr.info(friendRequestBody.receiverUsername + this.translate.instant("declined-your-friend-request!") );
          }
          else if (friendRequestBody.receiverUsername == this.currentUser.username) {
            this.getUser();
          }
        }
      })
      this.userService.getUserById(this.currentUser.id).subscribe(data => {
        this.user = data;
      })
      console.log(this.user.friendRequests);
    })
    }

  accept(userId, friendRequestId,i) {
    this.socketService.acceptFriendRequest(userId, friendRequestId);
    this.myFriendRequests.splice(i,1);
    this.nrOfFriendRequests--;
  }
  decline(userId, friendRequestId,i) {
    this.socketService.declineFriendRequest(userId, friendRequestId);
    this.myFriendRequests.splice(i,1);
    this.nrOfFriendRequests--;
  }
  logout() {
    this.tokenStorageService.signOut();
    this.socketService.disconnect();
    this.router.navigate(['login']);
  }
  getUser(){
    this.userService.getUserById(this.currentUser.id).subscribe(data => {
      this.user = data;
      this.friendRequests=this.user.friendRequests;

      if(this.friendRequests.length!==0){
        this.myFriendRequests=this.friendRequests.filter(fR=>fR.senderUsername!==this.currentUser.username);
        this.nrOfFriendRequests=this.myFriendRequests.length;
      }
      else{
        this.nrOfFriendRequests=0;
        this.myFriendRequests=[];
      }
    })
  }

  getCourseNotifications(){
    if(this.isLoggedIn){
      this.courseService.getCoursesByUserAcknowledged(this.currentUser.username).subscribe(data =>{
        // this.myNotifications= data;
        data.forEach( element =>{
          console.log(this.calculateDiff(element.date));

          if(this.calculateDiff(element.date) <= 24 && this.calculateDiff(element.date) > 0 ){
            element.due = this.calculateDiff(element.date);
            this.myNotifications.push(element);
            this.nrOfNotifications++;
          }
        })
      })
    }
  }

  acknowledgeNotification(notification, index){
    notification.acknowledged = true;
    this.courseService.editCourse(notification).subscribe(data=>{
      this.myNotifications.splice(index,1);
      this.nrOfNotifications--;
    })
  }
  calculateDiff(dateSent){
    let currentDate = new Date();
    dateSent = new Date(dateSent);
    return Math.floor((Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate())-Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())) /(1000 * 60 * 60));
}
}
