import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';;
import { User } from '../../../models/user';
import { TokenStorageService } from '../../../_services/token-storage.service';
import { UserService } from 'src/_services/user.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core/';
import { SocketService } from 'src/_services/socket.service';
import { Location } from '@angular/common';

@Component({
  selector: 'view-friends-profile',
  templateUrl: './view-friends-profile.component.html',
  styleUrls: ['./view-friends-profile.component.css']
})
export class ViewFriendsProfileComponent implements OnInit {

    url:any;
    noPhoto=true;
    currentUser:any;
    isSent: boolean= false;
    user: User;
    username:any;
    loggedUser:any;
    userFriends:Array<any> = new Array<any>();
    isLoggedIn = false;
  
  constructor( private route: ActivatedRoute,
      public translate: TranslateService, private tokenStorageService: TokenStorageService,
    private userService: UserService,
    private router:Router,
    private toastr:ToastrService,
    private socketService: SocketService,
    private _location: Location) { }

  ngOnInit() {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
        this.currentUser = this.tokenStorageService.getUser();
        this.username = this.route.snapshot.paramMap.get('username');
        this.getUserDetails();
        this.userService.getUserById(this.currentUser.id).subscribe(data=>{
          this.loggedUser=data;
          if(data.friendRequests.length!==0 && data.friendRequests.some(friendR=>friendR.receiverUsername == this.username)){
            this.isSent=true; 
        }
        })
    }
  }
  public goBack(): void {
    this._location.back();
}
sendFriendRequest(receiverId) {
  this.socketService.sendFriendRequest(this.tokenStorageService.getUser().id, receiverId);
  this.getUserDetails();
  this.userService.getUserById(this.currentUser.id).subscribe(data=>{
    if(data.friendRequests.length!==0 && data.friendRequests.some(friendR=>friendR.receiverUsername == this.username)){
      this.isSent=true; 
  }
  })
}
  getUserDetails(){
    this.userService.getUserByUsername(this.username).subscribe(data => {
      this.user=data;
      if(this.user.profilePicture){
      this.noPhoto=false;
  }
  this.user.friends.forEach(friend => {
    this.userService.getUserByUsername(friend).subscribe(data=>{
      this.userFriends.push(data);
    })
  });
})
  }
  viewFriendProfile(element): void {
    if(element.username==this.loggedUser.username){
      this.router.navigate(['/profile']);
    }
    else{
      this.router.navigate(['/friendRequestCenter/view/',element.username]);
    }
  }
}
