import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { User, LoginRequest } from '../models/user.model';
import { LoginService } from '../../services/login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly storageKey = 'task_portal_user';

  currentUser = signal<User | null>(this.getStoredUser());

  constructor(private loginService: LoginService) {}

  login(credentials: LoginRequest): Observable<User> {
    return this.loginService.login(credentials).pipe(
      tap((user) => {
        this.setUser(user);
      })
    );
  }

  setUser(user: User): void {
    this.setStoredUser(user);
    this.currentUser.set(user);
  }

  switchRole(role: string): void {
    const current = this.currentUser();
    if (current) {
      const updatedUser: User = { ...current, role };
      this.setUser(updatedUser);
    }
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
