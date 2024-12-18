import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../classes/user';
import { Maladie } from '../classes/maladie';
import { Leave } from '../classes/leave';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Injectable({
  providedIn: 'root',
})
export class MaladieService {
  private apiUrl = 'http://localhost:8080/api/maladie';
  private apiUrlu = 'http://localhost:8080/api/users';
  constructor(private http: HttpClient) {}
  getMaladie(): Observable<Maladie[]> {
    return this.http.get<Maladie[]>(this.apiUrl);
  }
  supprimerMaladie(id: number) {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url, httpOptions);
  }
  getUserMaladieHistory(userId: number): Observable<Maladie[]> {
    return this.http.get<Maladie[]>(`${this.apiUrl}/${userId}/history`);
  }
  submitMaladie(userId: number, maladie: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${userId}`, maladie);
  }
  getUserByMonth(month: number): Observable<Maladie[]> {
    return this.http.get<Maladie[]>(
      `http://localhost:8080/api/maladie/month?month=${month}`
    );
  }
  getByUserId(userId: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${userId}`);
  }
}
