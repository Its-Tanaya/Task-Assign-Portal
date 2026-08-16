import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { MockDataService } from '../../core/services/mock-data.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  constructor(
    public authService: AuthService,
    public mockData: MockDataService
  ) {}

  get currentEmployee() {
    const user = this.authService.getUser();
    if (!user) return null;
    return this.mockData.employees().find((e) => e.userId === user.userId) || this.mockData.employees()[0];
  }
}
