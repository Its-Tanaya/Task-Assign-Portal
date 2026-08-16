import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { User, LoginRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private storageKey = 'task_portal_user';

  private defaultUser: User = {
    userId: 1,
    username: 'sarah_hr',
    role: 'HR'
  };

  currentUser = signal<User | null>(this.getStoredUser() || this.defaultUser);

  constructor() {}

  login(credentials: LoginRequest): Observable<User> {
    // UI-only mock login response
    let role = 'Employee';
    const uname = credentials.username.toLowerCase();
    if (uname.includes('hr')) role = 'HR';
    else if (uname.includes('manager')) role = 'Manager';
    else if (uname.includes('lead')) role = 'Project Lead';

    const user: User = {
      userId: Math.floor(Math.random() * 100) + 1,
      username: credentials.username,
      role: role
    };

    this.setStoredUser(user);
    this.currentUser.set(user);
    return of(user);
  }

  switchRole(role: string): void {
    const current = this.currentUser();
    const updated: User = {
      userId: current?.userId || 1,
      username: current?.username || 'test_user',
      role: role
    };
    this.setStoredUser(updated);
    this.currentUser.set(updated);
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
    this.currentUser.set(null);
  }

  getUser(): User | null {
    return this.currentUser();
  }

  isLoggedIn(): boolean {
    return !!this.currentUser();
  }

  getRole(): string | null {
    return this.currentUser()?.role || null;
  }

  getUserId(): number | null {
    return this.currentUser()?.userId || null;
  }

  private getStoredUser(): User | null {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  private setStoredUser(user: User): void {
    localStorage.setItem(this.storageKey, JSON.stringify(user));
  }
}
