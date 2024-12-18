import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeaveRequestComponent } from './leave-request/leave-request.component';
import { SelectUserComponent } from './select-user/select-user.component';
import { LeaveHistoryComponent } from './leave-history/leave-history.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { authGuard } from './gurads/auth.guard';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { LeaveHeureComponent } from './leave-heure/leave-heure.component';
import { AddUserComponent } from './add-user/add-user.component';
import { MaladieComponent } from './maladie/maladie.component';

const routes: Routes = [
  { path: 'select-user', component: SelectUserComponent },
  { path: 'leave-history', component: LeaveHistoryComponent },
  // { path: '', redirectTo: '/select-user', pathMatch: 'full' },
  //{ path: 'home', component: HomeComponent }, // Utilisation de authGuard fonctionnel
  { path: 'login', component: LoginComponent },
  // { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'leave', component: LeaveRequestComponent },
  { path: 'admin', component: AdminDashboardComponent },
  { path: 'heure', component: LeaveHeureComponent },
  { path: 'home', component: HomeComponent },
  { path: 'addUser', component: AddUserComponent },
  { path: 'user-details/:id', component: LeaveHistoryComponent },
  { path: 'maladie', component: MaladieComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
