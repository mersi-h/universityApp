import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


const API_URL = 'http://localhost:8080/university/feed/';

@Injectable({
  providedIn: 'root'
})
export class FeedService {


constructor(private http: HttpClient) { }

  getAllPosts() : Observable<any>{

    return this.http.get(API_URL + "allFeeds");
  }

  addNewPOst(post): Observable<any> {
    return this.http.post(API_URL+"addFeed", post);
  }

  updatePost(post): Observable<any> {
    return this.http.put(API_URL + "update", post);
  }
}
