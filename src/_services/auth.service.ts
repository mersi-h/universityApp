import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { TokenStorageService } from './token-storage.service';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

const UNIVERSITY = 'http://localhost:8080/university/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user:User
  constructor(private http: HttpClient,
    private token:TokenStorageService,
    private router:Router) { }

  login(credentials): Observable<any> {
    return this.http.post(UNIVERSITY + 'login', {
      username: credentials.username,
      password: credentials.password
    }, httpOptions);
  }

  register(user): Observable<any> {
    return this.http.post(UNIVERSITY + 'register', {
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      role:user.role
    }, httpOptions);
  }
  canActivate(route: ActivatedRouteSnapshot):boolean{
    const expectedRole = route.data.expectedRole;
    this.user=this.token.getUser();
    if(!this.user.roles.includes(expectedRole)){
      this.router.navigate(['/']);      
      return false;
    }
    else{
      return true;
    }
  }
}
