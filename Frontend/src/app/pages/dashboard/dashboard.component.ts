import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MockDataService } from '../../core/services/mock-data.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  constructor(
    public authService: AuthService,
    public mockData: MockDataService
  ) {}

  get user() {
    return this.authService.getUser();
  }

  get role() {
    return this.authService.getRole();
  }

  get totalEmployees(): number {
    return this.mockData.employees().length;
  }

  get totalTasks(): number {
    return this.mockData.tasks().length;
  }

  get pendingTasks(): number {
    return this.mockData.assignments().filter((a) => a.status === 'Pending').length;
  }

  get completedTasks(): number {
    return this.mockData.assignments().filter((a) => a.status === 'Completed').length;
  }

  get recentTasks() {
    const tasks = this.mockData.tasks();
    const assignments = this.mockData.assignments();
    return tasks.slice(0, 4).map((t) => {
      const ass = assignments.find((a) => a.taskId === t.taskId);
      return {
        ...t,
        status: ass ? ass.status : 'Unassigned'
      };
    });
  }
}
