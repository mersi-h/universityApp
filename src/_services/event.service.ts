import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  nrOfFriendRequests = new Subject();
  private notificationSource = new Subject();
  notificationsChanges$ = this.notificationSource.asObservable();
  constructor() { }

  notificationAudit(notification : any){
    this.notificationSource.next(notification);
  }
}
