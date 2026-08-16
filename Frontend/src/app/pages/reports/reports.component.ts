import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataService } from '../../core/services/mock-data.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent {
  constructor(public mockData: MockDataService) {}

  get totalTasksCount(): number {
    return this.mockData.tasks().length;
  }

  get pendingCount(): number {
    return this.mockData.assignments().filter((a) => a.status === 'Pending').length;
  }

  get inProgressCount(): number {
    return this.mockData.assignments().filter((a) => a.status === 'In Progress').length;
  }

  get completedCount(): number {
    return this.mockData.assignments().filter((a) => a.status === 'Completed').length;
  }

  get overdueCount(): number {
    return this.mockData.assignments().filter((a) => a.status === 'Overdue').length;
  }

  get employeePerformance() {
    const employees = this.mockData.employees();
    const assignments = this.mockData.assignments();

    return employees.map((emp) => {
      const empAssignments = assignments.filter((a) => a.employeeId === emp.employeeId);
      const completed = empAssignments.filter((a) => a.status === 'Completed').length;
      const total = empAssignments.length;
      const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

      return {
        employee: emp,
        assignedCount: total,
        completedCount: completed,
        pendingCount: empAssignments.filter((a) => a.status === 'Pending').length,
        overdueCount: empAssignments.filter((a) => a.status === 'Overdue').length,
        completionRate: rate
      };
    });
  }
}
