import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:8080/university/'
@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor(private http: HttpClient) { }

  getAllUniversities(): Observable<any>{
    return this.http.get(API_URL+'universities/all');
  }
  getUniversityByName(name:string): Observable<any>{
    return this.http.get(API_URL+'universities/getByName/'+name);
  }
  getAllCourses(parameters): Observable<any>{
    return this.http.get(API_URL+'course/all',{params:parameters});
  }
  getCourseByName(name:string): Observable<any>{
    return this.http.get(API_URL+'course/name/'+name);
  }
  addCourse(course:any): Observable<any>{
    return this.http.post(API_URL+'course/add',course);
  }
  deleteCourse(name:string): Observable<any>{
    return this.http.delete(API_URL+'course/delete/name/'+name);
  }
  editCourse(course:any): Observable<any>{
    return this.http.put(API_URL+'course/edit',course);
  }
  addUserToCourse(courseName:string,username:string){
    return this.http.post(API_URL+'course/courseName/'+courseName+'/addUser',username);
  }
  deleteUserFromCourse(courseName:string,username:string){
    return this.http.delete(API_URL+'courseName/'+courseName+'/deleteUser/'+username);
  }
  getCoursesByUser(userid): Observable<any>{
    return this.http.get(API_URL+'course/user/id/'+userid);
  }
  getCoursesByUserAcknowledged(username): Observable<any>{
    return this.http.get(API_URL+'course/user/acknowledged/username/'+username);
  }
}
