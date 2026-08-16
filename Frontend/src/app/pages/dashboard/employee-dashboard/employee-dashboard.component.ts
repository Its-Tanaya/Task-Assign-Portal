import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { MockDataService } from '../../../core/services/mock-data.service';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './employee-dashboard.component.html',
  styleUrl: './employee-dashboard.component.scss'
})
export class EmployeeDashboardComponent {
  constructor(
    public authService: AuthService,
    public mockData: MockDataService
  ) {}

  get user() {
    return this.authService.getUser();
  }

  get currentEmployee() {
    const user = this.user;
    if (!user) return null;
    return this.mockData.employees().find((e) => e.userId === user.userId) || this.mockData.employees()[3]; // Fallback to employee Halpert
  }

  get myAssignments() {
    const emp = this.currentEmployee;
    if (!emp) return [];
    const assignments = this.mockData.assignments().filter((a) => a.employeeId === emp.employeeId);
    const tasks = this.mockData.tasks();

    return assignments.map((a) => {
      const task = tasks.find((t) => t.taskId === a.taskId);
      return {
        assignment: a,
        task: task!
      };
    }).filter((item) => item.task);
  }

  get myPendingCount(): number {
    return this.myAssignments.filter((m) => m.assignment.status === 'Pending').length;
  }

  get myInProgressCount(): number {
    return this.myAssignments.filter((m) => m.assignment.status === 'In Progress').length;
  }

  get myCompletedCount(): number {
    return this.myAssignments.filter((m) => m.assignment.status === 'Completed').length;
  }

  get myOverdueCount(): number {
    return this.myAssignments.filter((m) => m.assignment.status === 'Overdue').length;
  }

  get myRecentMessages() {
    const emp = this.currentEmployee;
    if (!emp) return [];
    return this.mockData
      .messages()
      .filter((m) => m.receiverId === emp.userId || m.senderId === emp.userId)
      .slice(-3)
      .reverse();
  }

  updateMyTaskStatus(assignmentId: number, event: Event): void {
    const select = event.target as HTMLSelectElement;
    if (select.value) {
      this.mockData.updateAssignmentStatus(assignmentId, select.value);
    }
  }
}
