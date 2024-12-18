import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../classes/user';
import { Leave } from '../classes/leave';
import { Etat } from './etat.model';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Injectable({
  providedIn: 'root',
})
export class LeaveService {
  private apiUrl = 'http://localhost:8080/api/leaves';
  private apiUrlu = 'http://localhost:8080/api/users';
  private baseUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  // Récupérer la liste des utilisateurs
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrlu}`);
  }
  getLeaveRequests(): Observable<Leave[]> {
    return this.http.get<Leave[]>(this.apiUrl);
  }
  supprimerLeave(id: number) {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url, httpOptions);
  }
  getUserLeaveHistory(userId: number): Observable<Leave[]> {
    return this.http.get<Leave[]>(`${this.apiUrl}/${userId}/history`);
  }

  getRequestsByEtat(userId: number, etat: Etat): Observable<Leave[]> {
    return this.http.get<Leave[]>(`${this.apiUrl}/${userId}/etat/${etat}`);
  }
  submitLeaveRequest(userId: number, leaveRequest: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${userId}`, leaveRequest);
  }

  getLeaveRequestsByEtats(ett: Etat): Observable<Leave[]> {
    return this.http.get<Leave[]>(`${this.apiUrl}/etat/${ett}`);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, { email, password });
  }
  getApprovedDays(userId: number): Observable<number> {
    return this.http.get<number>(
      `http://localhost:8080/api/leaves/${userId}/approved-days`
    );
  }
  updateLeaveRequest(leaveRequest: Leave): Observable<Leave> {
    const url = `${this.apiUrl}/${leaveRequest.id}`;
    return this.http.put<Leave>(url, leaveRequest, httpOptions);
  }

  getLeaveRequestsByEtat(ett: Etat): Observable<Leave[]> {
    return this.http.get<Leave[]>(`${this.apiUrl}?ett=${ett}`);
  }
  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrlu}/${userId}`);
  }
  getLeaveRequestsByMonth(month: number): Observable<Leave[]> {
    return this.http.get<Leave[]>(
      `http://localhost:8080/api/leaves/leave-requests?month=${month}`
    );
  }
}
