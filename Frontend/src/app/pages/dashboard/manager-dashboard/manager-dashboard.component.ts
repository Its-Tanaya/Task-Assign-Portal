import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { MockDataService } from '../../../core/services/mock-data.service';

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './manager-dashboard.component.html',
  styleUrl: './manager-dashboard.component.scss'
})
export class ManagerDashboardComponent {
  constructor(
    public authService: AuthService,
    public mockData: MockDataService
  ) {}

  get user() {
    return this.authService.getUser();
  }

  get teamMembersCount(): number {
    return this.mockData.employees().length;
  }

  get totalTeamTasks(): number {
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

  get teamTaskRows() {
    const tasks = this.mockData.tasks();
    const assignments = this.mockData.assignments();
    const employees = this.mockData.employees();

    return tasks.map((t) => {
      const ass = assignments.find((a) => a.taskId === t.taskId);
      const emp = ass ? employees.find((e) => e.employeeId === ass.employeeId) : null;
      return {
        task: t,
        assignee: emp ? emp.name : 'Unassigned',
        status: ass ? ass.status : 'Unassigned'
      };
    });
  }
}
