import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { MockDataService } from '../../../core/services/mock-data.service';

@Component({
  selector: 'app-hr-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './hr-dashboard.component.html',
  styleUrl: './hr-dashboard.component.scss'
})
export class HrDashboardComponent {
  constructor(
    public authService: AuthService,
    public mockData: MockDataService
  ) {}

  get user() {
    return this.authService.getUser();
  }

  get totalEmployees(): number {
    return this.mockData.employees().length;
  }

  get activeEmployees(): number {
    return this.mockData.employees().length; // All mock employees active
  }

  get totalTasks(): number {
    return this.mockData.tasks().length;
  }

  get pendingTasks(): number {
    return this.mockData.assignments().filter((a) => a.status === 'Pending').length;
  }

  get inProgressTasks(): number {
    return this.mockData.assignments().filter((a) => a.status === 'In Progress').length;
  }

  get completedTasks(): number {
    return this.mockData.assignments().filter((a) => a.status === 'Completed').length;
  }

  get overdueTasks(): number {
    return this.mockData.assignments().filter((a) => a.status === 'Overdue').length;
  }

  get recentEmployees() {
    return this.mockData.employees().slice(-4).reverse();
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
