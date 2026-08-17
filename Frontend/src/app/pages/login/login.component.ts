import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  username = '';
  password = '';
  selectedRole = 'HR';

  errorMessage = '';
  loading = false;

  roles = ['HR', 'Manager', 'Project Lead', 'Employee'];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin(): void {
    if (!this.username.trim() || !this.password) {
      this.errorMessage = 'Please enter username and password.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login({
      username: this.username.trim(),
      password: this.password
    }).subscribe({
      next: (user) => {
        this.loading = false;

        const role = user.role || this.selectedRole;
        switch (role) {
          case 'HR':
            this.router.navigate(['/hr/dashboard']);
            break;
          case 'Manager':
            this.router.navigate(['/manager/dashboard']);
            break;
          case 'Project Lead':
            this.router.navigate(['/lead/dashboard']);
            break;
          default:
            this.router.navigate(['/employee/dashboard']);
            break;
        }
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 401) {
          this.errorMessage = 'Invalid username or password.';
        } else {
          this.errorMessage = 'Login failed. Could not connect to backend server.';
        }
      }
    });
  }
}
