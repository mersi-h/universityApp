import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { WebSocketAPI } from 'src/app/webSocket/WebSocketApi';
import { TokenStorageService } from './token-storage.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  currentUser:any;

  webSocketAPI: WebSocketAPI = new WebSocketAPI();
  constructor(private userService:UserService,private tokenStorage: TokenStorageService) { 
    if(tokenStorage.getUser()){
      this.webSocketAPI._connect();
    }
    TokenStorageService.loggedIn.subscribe((isLoggedIn)=>{
      if(isLoggedIn){
        this.webSocketAPI._connect();
      }
    })
    this.currentUser=this.tokenStorage.getUser();
  }

  public sendFriendRequest(senderId,receiverId){
    this.webSocketAPI._sendFriendRequest(senderId, receiverId);
  }
  public acceptFriendRequest(userId,friendRequestId){
    this.webSocketAPI._acceptFriendRequest(userId,friendRequestId);
  }
  public declineFriendRequest(userId,friendRequestId){
    this.webSocketAPI._declineFriendRequest(userId,friendRequestId);
  }
  public disconnect(){
    this.webSocketAPI._disconnect();
  }
  public connect(){
    this.webSocketAPI._connect();
  }
}
