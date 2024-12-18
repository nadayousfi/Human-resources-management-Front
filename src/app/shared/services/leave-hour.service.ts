import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../classes/user';
import { Leave } from '../classes/leave';
import { LeaveHour } from '../classes/leave-hour';
import { Etat } from './etat.model';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Injectable({
  providedIn: 'root',
})
export class LeaveHourService {
  private apiUrlH = 'http://localhost:8080/api/hours';
  private apiUrUser = 'http://localhost:8080/api/users';
  constructor(private http: HttpClient) {}
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrUser}`);
  }
  getLeaveHourRequests(): Observable<LeaveHour[]> {
    return this.http.get<LeaveHour[]>(this.apiUrlH);
  }
  supprimerLeave(id: number) {
    const url = `${this.apiUrlH}/${id}`;
    return this.http.delete(url, httpOptions);
  }
  getUserLeaveHistory(userId: number): Observable<LeaveHour[]> {
    return this.http.get<LeaveHour[]>(`${this.apiUrlH}/${userId}/history`);
  }
  getRequestsByEtat(userId: number, etat: Etat): Observable<LeaveHour[]> {
    return this.http.get<LeaveHour[]>(`${this.apiUrlH}/${userId}/etat/${etat}`);
  }
  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrlH}/${userId}`);
  }
  getLeaveRequestsByEtat(ett: Etat): Observable<LeaveHour[]> {
    return this.http.get<LeaveHour[]>(`${this.apiUrlH}?ett=${ett}`);
  }
  updateLeaveRequest(leaveRequest: LeaveHour): Observable<LeaveHour> {
    const url = `${this.apiUrlH}/${leaveRequest.id}`;
    return this.http.put<LeaveHour>(url, leaveRequest, httpOptions);
  }
  getApprouvedHours(userId: number): Observable<number> {
    return this.http.get<number>(
      `http://localhost:8080/api/hours/${userId}/appoved-hours`
    );
  }
  getLeavRequestsByEtats(ett: Etat): Observable<LeaveHour[]> {
    return this.http.get<LeaveHour[]>(`${this.apiUrlH}/etat/${ett}`);
  }
  submitLeaveRequest(userId: number, LeaveHour: any): Observable<any> {
    return this.http.post(`${this.apiUrlH}/${userId}`, LeaveHour);
  }
}
