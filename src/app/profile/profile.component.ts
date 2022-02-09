import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { startWith,map } from 'rxjs/operators';
import { User } from '../../models/user';
import { TokenStorageService } from '../../_services/token-storage.service';
import { UserService } from 'src/_services/user.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core/';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

    selectedFile:File;
    url:any;
    noPhoto=true;

    user: any;
    userFriends:Array<any> = new Array<any>();
    isLoggedIn = false;
    editMode=false;
  
  constructor(public translate: TranslateService, private tokenStorageService: TokenStorageService,
    private userService: UserService,
    private router:Router,
    private toastr:ToastrService) { }

  ngOnInit() {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      this.user = this.tokenStorageService.getUser();
      this.userService.getUserById(this.user.id).subscribe(data => {
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
  }
  updateUser(){
    this.userService.editUser(this.user.id, this.user).subscribe(
      data=>{
        console.log(data);
        this.toastr.success( this.translate.instant("Profile-edited-successfully!") )
        this.editMode=!this.editMode;
      },
      error=>{
        this.toastr.error(error.error);
      }
    );
    
  }
  editForm(){
    this.editMode=!this.editMode;
  }
  addPhoto(){
    document.getElementById('photo').click();  
  }
  viewFriendProfile(element): void {
    console.log(element.username);
    this.router.navigate(['/friendRequestCenter/view/',element.username]);
  }
  courseDetails(name){
    this.router.navigate(['/course/',name]);
  }
  updateFile(e:Event) {
    this.selectedFile = (e.target as HTMLInputElement).files[0];
    if(this.selectedFile.size>2097152){
      alert( this.translate.instant("File-is-too-big!") );
    }
    else{
    var reader=new FileReader();
    reader.readAsDataURL(this.selectedFile);
    reader.onload=()=>{
      this.url=reader.result;
      this.user.profilePicture =this.url;
      this.noPhoto=false;
      this.userService.editUser(this.user.id, this.user).subscribe(
        data=>{
          console.log(data);
          this.toastr.success( this.translate.instant("Profile-edited-successfully!") )
        },
        error=>{
          this.toastr.error(error.error);
        }
      );
    }
    
  }
  
}
}
