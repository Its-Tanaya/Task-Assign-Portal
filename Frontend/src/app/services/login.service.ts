import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from './api.config';
import { LoginRequest, User } from '../core/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private readonly apiUrl = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.login}`;

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<User> {
    return this.http.post<User>(this.apiUrl, credentials);
  }
}
