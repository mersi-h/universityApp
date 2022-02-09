import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../_services/auth.service';
import { TokenStorageService } from '../../_services/token-storage.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';

import { TranslateService } from '@ngx-translate/core/';
import { TranslateConfigService } from 'src/_services/translate-config.service'
import { SocketService } from 'src/_services/socket.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup;
  public registerForm: FormGroup;
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  public drop_down_value = localStorage.getItem('lang');

  constructor(public translate: TranslateService, private translateConfigService: TranslateConfigService, private authService: AuthService,
             private tokenStorage: TokenStorageService, private socket:SocketService,
             private router:Router,
             private fb: FormBuilder,
             private toastr:ToastrService) {

              this.loginForm = fb.group({
                username: [null, Validators.required],
                password: [null, Validators.required]
            })
            this.registerForm =fb.group({
              firstName: [null, Validators.required],
              lastName: [null, Validators.required],
              email: [null, Validators.required],
              username: [null, Validators.required],
              password: [null, Validators.required]
            })
  }

  
  ngOnInit(): void {
    TokenStorageService.loggedIn.subscribe(loggedIn=>{
      this.isLoggedIn=loggedIn;
    })
    if ( this.isLoggedIn) {
      this.roles = this.tokenStorage.getUser().roles;
      this.router.navigate(['home']);
    }
  }

  login(formValue): void {
    this.authService.login(formValue).subscribe(
      data => {
        this.tokenStorage.saveToken(data.token);
        this.tokenStorage.saveUser(data);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().roles;
        TokenStorageService.loggedIn.next(this.isLoggedIn);
        this.router.navigate(['/home']);
      },
      err => {
        this.toastr.error( this.translate.instant("Username-or-password-is-wrong!") );
        this.isLoginFailed = true;
      }
    );
    // }
  }
  register(form): void{
    if(!form.valid){
      this.toastr.error( this.translate.instant("Please-fill-out-all-the-required-fields!") );
    }
    else{
      form.value.role=['USER'];
    this.authService.register(form.value).subscribe(()=>{
      this.toastr.success("You registered succesfully!");
      this.loginForm.patchValue({username:form.value.username, password:form.value.password});
      this.login(this.loginForm.value);
    },
    err=>{
      this.toastr.error(err.error.message);
    })
  }
  }

  public selectLanguage(lang: string): void {
    this.translateConfigService.changeLanguage(lang);
  }

  reloadPage(): void {
    location.reload();
  }
}
