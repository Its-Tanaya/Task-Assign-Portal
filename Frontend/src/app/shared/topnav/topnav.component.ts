import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-topnav',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './topnav.component.html',
  styleUrl: './topnav.component.scss'
})
export class TopnavComponent {
  roles = ['HR', 'Manager', 'Project Lead', 'Employee'];

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  onRoleChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const newRole = select.value;
    if (newRole) {
      this.authService.switchRole(newRole);
      switch (newRole) {
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
    }
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
