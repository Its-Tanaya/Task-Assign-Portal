import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  constructor(public authService: AuthService) {}

  get role(): string {
    return this.authService.getRole() || '';
  }

  isHr(): boolean {
    return this.role === 'HR';
  }

  isManager(): boolean {
    return this.role === 'Manager';
  }

  isLead(): boolean {
    return this.role === 'Project Lead';
  }

  isEmployee(): boolean {
    return this.role === 'Employee';
  }
}
