import { CourseService } from './../../_services/course.service';
import { ChangeDetectorRef, Component, Directive, Input, OnChanges, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { Feed } from 'src/models/feed';
import { User } from 'src/models/user';
import { AuthService } from 'src/_services/auth.service';
import { FeedService } from 'src/_services/feed.service';
import { TokenStorageService } from 'src/_services/token-storage.service';
import { UserService } from 'src/_services/user.service';
import { WebSocketAPI } from '../webSocket/WebSocketApi';
import {Comment} from "../../models/comment";
import { TranslateService } from '@ngx-translate/core/';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public createPostForm: FormGroup;
  public createCommentForm : FormGroup;
  public posts : Feed[] = [];
  public courses : any;
  public friends : any;

  public currentUser: User;
  constructor(public translate: TranslateService, private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private router:Router,
    private courseService : CourseService,
    private feedService: FeedService,
    private fb: FormBuilder,
    private toastr:ToastrService,
    private userService: UserService) {

      this.createPostForm = fb.group({
        createPostContent : [null, Validators.required]
      })
      this.createCommentForm = fb.group({
        commentContent : [null, Validators.required]
      })
     this.currentUser = this.tokenStorage.getUser();
   }


  createPostContent: string;
  createPost(value){
    console.log("this user",this.tokenStorage.getUser(),"posted this : ",value);
    let newPost : Feed = new Feed();
    newPost.content = value.createPostContent;
    newPost.userId  = this.tokenStorage.getUser().username;
    this.feedService.addNewPOst(newPost).subscribe(data =>{
      this.toastr.success( this.translate.instant("Post-addedd-successfully!!") );
      this.reloadFeed();
      this.createPostForm.reset();
    })
  }

  createComment(post,value){
    let newComment: Comment = new Comment();
    newComment.userId  = this.tokenStorage.getUser().username;
    newComment.content = value.commentContent;

    post.comments.push(newComment);
    console.log(typeof(post.comments));
    this.feedService.updatePost(post).subscribe(data => {
      this.createCommentForm.reset();
      //this.reloadFeed();
    })
  }

  likePost(post){
    if(post.likes.indexOf(this.currentUser.username) == -1){
      post.likes.push(this.currentUser.username);

    }
    else{
      post.likes.splice(post.likes.indexOf(this.currentUser.username),1);
    }
    this.feedService.updatePost(post).subscribe(data =>{
      //this.reloadFeed();
    })

  }

  hasLiked(post): boolean{
    if(post.likes.indexOf(this.currentUser.username) != -1 )
      return true;
    else
      return false;
  }
  reloadFeed(){
    this.userService.getUserById(this.currentUser.id).subscribe(data=>{
      this.friends=data.friends;
      console.log(this.friends);
    })
    this.feedService.getAllPosts().subscribe(data =>{
      this.posts = data;
      console.log("posts", this.posts);
    })
  }
  ngOnInit(): void {
      this.reloadFeed();
  }


  ngSubmit(){


    console.log("ng Submit posted this : ",this.createPostContent);
  }
}
