import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { User } from 'src/models/user';
import { TokenStorageService } from 'src/_services/token-storage.service';
import { LoginComponent } from './login/login.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'universityCoursesApp';
  roles: string[];
  isLoggedIn = false;
  loggedIn = false;
    showAdminBoard = false;
    username: string;
    currentUser: User;

    constructor( private tokenStorageService: TokenStorageService,private router:Router,
                 private translateService: TranslateService) { }
  
    ngOnInit(): void {
      this.isLoggedIn=!!this.tokenStorageService.getToken();
      TokenStorageService.loggedIn.subscribe(loggedIn=>{
        this.isLoggedIn=loggedIn;
      })
      if(!this.isLoggedIn){
        this.router.navigate(['login']);
      }
      if (localStorage.getItem('lang')  == "al"){
        this.translateService.use('al');
    }
    else{
        localStorage.setItem('lang', 'en');
        this.translateService.use('en');
    }
    }
  
    logout(): void {
      this.tokenStorageService.signOut();
      this.router.navigate(['login'])
    }
}
