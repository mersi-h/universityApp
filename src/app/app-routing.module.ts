import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { FriendsComponent } from './friends/friends.component';
import { ProfileComponent } from './profile/profile.component';
import { ViewFriendsProfileComponent } from './friends/view-friends-profile/view-friends-profile.component';
import { CourseComponent } from './course/course.component';
import { CalendarComponent } from './calendar/calendar.component';
import { CourseDetailsComponent } from './course-details/course-details.component';



const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'friendRequestCenter', component: FriendsComponent},
  { path: 'home', component: HomeComponent},
  { path: 'profile', component: ProfileComponent},
  { path: 'friendRequestCenter/view/:username', component: ViewFriendsProfileComponent,   }, 
  { path: 'course', component: CourseComponent},
  { path: 'calendar', component: CalendarComponent},
  { path: 'course/:name',component:CourseDetailsComponent},
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: '**', redirectTo: 'home'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {

}
