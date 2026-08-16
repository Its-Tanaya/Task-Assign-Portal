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
    if (!this.username) {
      this.errorMessage = 'Please enter a username.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login({
      username: this.username,
      password: this.password
    }).subscribe({
      next: (user) => {
        // Apply selected role for demo testing
        this.authService.switchRole(this.selectedRole);
        this.loading = false;

        switch (this.selectedRole) {
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
      error: () => {
        this.loading = false;
        this.errorMessage = 'Login failed. Please check credentials.';
      }
    });
  }
}
