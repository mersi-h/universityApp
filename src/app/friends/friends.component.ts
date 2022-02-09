import { HttpParams } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { SocketService } from 'src/_services/socket.service';
import { TokenStorageService } from 'src/_services/token-storage.service';
import { UserService } from 'src/_services/user.service';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { WebSocketAPI } from '../webSocket/WebSocketApi';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {

  isLoggedIn = false;
  username: string;
  user: any;
  name: string;
  currentUser: any;
  nrOfFriendRequests: any;
  newFriendRequest: any;
  allUsers: Array<any> = new Array<any>();
  requestedUsers: Array<any> = new Array<any>();
  friendRequests : BehaviorSubject<any>;
  public page=0;
  public size=10;
  length:any;

  constructor(private tokenStorageService: TokenStorageService,
    private router: Router,
    private toastr: ToastrService,
    private userService: UserService,
    private socketService:SocketService
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      this.currentUser = this.tokenStorageService.getUser();
      this.username = this.currentUser.username;
      this.userService.getUserById(this.currentUser.id).subscribe(data => {
        this.nrOfFriendRequests = data.friendRequests.length;
        this.user=data;
      })
      this.getAll();
    }
    else
      this.router.navigate(['/login']);
  }
  handlePage(event:PageEvent){
    this.page=event.pageIndex;
    this.size=event.pageSize;
    this.getAll();
  }
  getAll(){
    this.allUsers=[];
    this.requestedUsers=[];
    this.userService.getUserById(this.currentUser.id).subscribe(data => {
      this.user=data;
      let params=new HttpParams()
      .set('page', String(this.page))
      .append('size', String(this.size))

      this.userService.getAllUsers(params).subscribe(data => {
        data.content.forEach(element => {
          if(element.id!=this.user.id 
            && !this.user.friendRequests.some(friendR=>friendR.senderUsername == element.username)
            && !this.user.friends.includes(element.username)
            && element.username!="admin"){
            this.allUsers.push(element);
            this.length=this.allUsers.length;
          }
          if(this.user.friendRequests.some(friendR=>friendR.receiverUsername == element.username)){
            this.requestedUsers.push(element.id); 
          }          
        });
      })
    })
    console.log(this.requestedUsers);
    
    
  }
  search(value:string){
    this.allUsers=[];
    // this.requestedUsers=[];
    let params=new HttpParams()
            .set('page', String(this.page))
            .append('size', String(this.size))
            .append('username', value)
    
   this.userService.getAllUsers(params).subscribe(data => {
        data.content.forEach(element => {
          if(element.id!=this.user.id 
            && !this.user.friendRequests.some(friendR=>friendR.senderUsername == element.username)
            && !this.user.friends.includes(element.username)
            && element.username!="admin"){
            this.allUsers.push(element);
            this.length=this.allUsers.length;
          }
          if(this.user.friendRequests.some(friendR=>friendR.receiverUsername == element.username)){
            this.requestedUsers.push(element.id); 
          }   
        });
      }) 
       
  }
  sendFriendRequest(receiverId) {
    this.socketService.sendFriendRequest(this.tokenStorageService.getUser().id, receiverId);
    this.allUsers=[];
    // this.requestedUsers=[];
    let params=new HttpParams()
            .set('page', String(this.page))
            .append('size', String(this.size))
            
    this.userService.getAllUsers(params).subscribe(data => {
      data.content.forEach(element => {
        if(element.id!=this.user.id 
          && !this.user.friendRequests.some(friendR=>friendR.senderUsername == element.username)
          && !this.user.friends.includes(element.username)
          && element.username!="admin"){
          this.allUsers.push(element);
          this.length=this.allUsers.length;
        }
        if(this.user.friendRequests.some(friendR=>friendR.receiverUsername == element.username)){
          this.requestedUsers.push(element.id); 
        }   
      });
      this.requestedUsers.push(receiverId);
    }) 
  }
  public viewFriendProfile(element): void {
    this.router.navigateByUrl(this.router.url + '/view/' + element.username);
  }

}
