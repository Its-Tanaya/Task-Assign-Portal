import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User, LoginRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private storageKey = 'task_portal_user';

  // Mock accounts mapping
  private mockUsers: { [emailOrKey: string]: User } = {
    'hr@taskassign.com': { userId: 1, username: 'Sarah Jenkins', role: 'HR' },
    'manager@taskassign.com': { userId: 2, username: 'Michael Scott', role: 'Manager' },
    'lead@taskassign.com': { userId: 3, username: 'Dwight Schrute', role: 'Project Lead' },
    'employee@taskassign.com': { userId: 5, username: 'Rahul Patil', role: 'Employee' },
    // Fallback role aliases
    'hr': { userId: 1, username: 'Sarah Jenkins', role: 'HR' },
    'manager': { userId: 2, username: 'Michael Scott', role: 'Manager' },
    'lead': { userId: 3, username: 'Dwight Schrute', role: 'Project Lead' },
    'employee': { userId: 5, username: 'Rahul Patil', role: 'Employee' }
  };

  private defaultUser: User = {
    userId: 5,
    username: 'Rahul Patil',
    role: 'Employee'
  };

  currentUser = signal<User | null>(this.getStoredUser() || this.defaultUser);

  constructor() {}

  login(credentials: LoginRequest): Observable<User> {
    const key = credentials.username.toLowerCase().trim();
    let user: User;

    if (this.mockUsers[key]) {
      user = this.mockUsers[key];
    } else if (key.includes('hr')) {
      user = this.mockUsers['hr@taskassign.com'];
    } else if (key.includes('manager')) {
      user = this.mockUsers['manager@taskassign.com'];
    } else if (key.includes('lead')) {
      user = this.mockUsers['lead@taskassign.com'];
    } else {
      user = {
        userId: 5,
        username: credentials.username,
        role: 'Employee'
      };
    }

    this.setStoredUser(user);
    this.currentUser.set(user);
    return of(user);
  }

  switchRole(role: string): void {
    let targetUser: User;
    if (role === 'HR') targetUser = this.mockUsers['hr@taskassign.com'];
    else if (role === 'Manager') targetUser = this.mockUsers['manager@taskassign.com'];
    else if (role === 'Project Lead') targetUser = this.mockUsers['lead@taskassign.com'];
    else targetUser = this.mockUsers['employee@taskassign.com'];

    this.setStoredUser(targetUser);
    this.currentUser.set(targetUser);
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
