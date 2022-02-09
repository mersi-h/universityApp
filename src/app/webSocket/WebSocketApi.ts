import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { HomeComponent } from '../home/home.component';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { EventEmitter, Output } from '@angular/core';

export class WebSocketAPI {
    webSocketEndPoint: string = 'http://localhost:8080/university/websocket';
    topic: string = "/topic/friendRequest";
    topic2: string = "/topic/friendRequest/action"
    stompClient: any;
    public static friendReqSubject: Subject<any> = new Subject;
    public static status: Subject<any> = new Subject;
    friendRequestStatus: any;
    constructor() {
    }
    _connect() {
        console.log("Initialize WebSocket Connection");
        let ws = new SockJS(this.webSocketEndPoint);
        this.stompClient = Stomp.over(ws);
        const _this = this;
        _this.stompClient.connect({}, function (frame) {
            _this.stompClient.subscribe(_this.topic, function (message) {
                _this.onFriendRequestReceived(JSON.parse(message.body));
            });
            _this.stompClient.subscribe(_this.topic2, function (message) {
            if(JSON.parse(message.body).statusCode=="ACCEPTED"){
                _this.onAccepted(JSON.parse(message.body));
            }
            else if(JSON.parse(message.body).statusCode=="NOT_ACCEPTABLE"){
                _this.onDeclined(JSON.parse(message.body));
            }
        });

        }, this.errorCallBack);
    };

    _disconnect() {
        if (this.stompClient !== null) {
            this.stompClient.disconnect();
        }
        console.log("Disconnected");
    }

    // on error, schedule a reconnection attempt
    errorCallBack(error) {
        console.log("errorCallBack -> " + error)
        setTimeout(() => {
            this._connect();
        }, 5000);
    }

    _sendFriendRequest(sender, receiver) {
        console.log("Sending friend request...");
        this.stompClient.send("/university/friendRequest/" + sender + "/sendTo/" + receiver, {});
        this.friendRequestStatus = "SENT";

    }
    _acceptFriendRequest(userId, friendRequestId) {
        console.log("Accepting friend request...");
        this.stompClient.send("/university/friendRequest/" + userId + "/accept/" + friendRequestId, {})
        this.friendRequestStatus = "ACCEPTED";
    }
    _declineFriendRequest(userId, friendRequestId) {
        console.log("Declining friend request...");
        this.stompClient.send("/university/friendRequest/" + userId + "/decline/" + friendRequestId, {})
        this.friendRequestStatus = "DECLINED";
    }

    onAccepted(accepted) {
        console.log("Friend Request accepted!");
        console.log(accepted.body);
        WebSocketAPI.friendReqSubject.next(accepted);
        WebSocketAPI.status.next("ACCEPTED");
    }
    onDeclined(declined) {
        console.log("Friend Request declined!");
        console.log(declined.body);
        WebSocketAPI.friendReqSubject.next(declined);
        WebSocketAPI.status.next("DECLINED");
    }
    onFriendRequestReceived(newFriendRequest) {
        console.log("Friend Request received.");
        console.log(newFriendRequest.body);
        WebSocketAPI.friendReqSubject.next(newFriendRequest.body);
        WebSocketAPI.status.next("RECEIVED");
    }
}