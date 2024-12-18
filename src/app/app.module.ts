import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LeaveRequestComponent } from './leave-request/leave-request.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SelectUserComponent } from './select-user/select-user.component';
import { LeaveHistoryComponent } from './leave-history/leave-history.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { LeaveHeureComponent } from './leave-heure/leave-heure.component';
import { AddUserComponent } from './add-user/add-user.component';
import { MaladieComponent } from './maladie/maladie.component';

@NgModule({
  declarations: [
    AppComponent,
    LeaveRequestComponent,
    AdminDashboardComponent,
    SelectUserComponent,
    LeaveHistoryComponent,
    HomeComponent,
    LoginComponent,
    LeaveHeureComponent,
    AddUserComponent,
    MaladieComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
  ],
  providers: [provideClientHydration()],
  bootstrap: [AppComponent],
})
export class AppModule {}
