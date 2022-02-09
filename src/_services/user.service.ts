import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {FormGroup, FormControl}  from '@angular/forms';
import { User } from '../models/user'

const API_URL = 'http://localhost:8080/university/user/';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  constructor(private http: HttpClient) { }

  getUserById(userId): Observable<any> {
    return this.http.get(API_URL + 'getUser/'+userId);
  }
  getUserByUsername(username:string): Observable<any>{
    return this.http.get(API_URL + 'getUserByUsername/'+username);
  }
  editUser(userId, updatedUser): Observable<any> {
    return this.http.post(API_URL + 'updateUser/'+userId, updatedUser);
  }
  getAllUsers(parameters): Observable<any> {
    return this.http.get(API_URL + 'all',{params:parameters});
  }
  joinCourse(username:any,courseName:any): Observable<any>{
    return this.http.post(API_URL + 'joinCourse/username/'+username,courseName);
  }
  leaveCourse(username:any,courseName:any): Observable<any>{
    return this.http.post(API_URL + 'leaveCourse/username/'+username,courseName);
  }

}
