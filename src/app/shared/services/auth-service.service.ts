import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  private baseUrl = 'http://localhost:8080/api/auth'; // URL de ton backend
  private isAuthenticated = false;

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, { email, password });
  }

  setAuthenticated(auth: boolean): void {
    this.isAuthenticated = auth;
  }

  isLoggedIn(): boolean {
    return true;
    //return this.isAuthenticated;
  }
}
