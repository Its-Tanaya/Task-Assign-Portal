import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataService } from '../../core/services/mock-data.service';

interface EmployeePerformanceRow {
  employee: {
    employeeCode: string;
    name: string;
    role: string;
  };
  assignedCount: number;
  completedCount: number;
  pendingCount: number;
  overdueCount: number;
  completionRate: number;
}

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
    return 0;
  }

  get pendingCount(): number {
    return 0;
  }

  get inProgressCount(): number {
    return 0;
  }

  get completedCount(): number {
    return 0;
  }

  get overdueCount(): number {
    return 0;
  }

  get employeePerformance(): EmployeePerformanceRow[] {
    return [];
  }
}
