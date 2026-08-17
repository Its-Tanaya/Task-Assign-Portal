import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { MockDataService } from '../../core/services/mock-data.service';
import { EmployeeService } from '../../services/employee.service';
import { TaskService } from '../../services/task.service';
import { TaskAssignmentService } from '../../services/task-assignment.service';
import { Employee } from '../../core/models/employee.model';
import { TaskItem } from '../../core/models/task.model';
import { TaskAssignment } from '../../core/models/task-assignment.model';

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
export class ReportsComponent implements OnInit {
  employees: Employee[] = [];
  tasks: TaskItem[] = [];
  assignments: TaskAssignment[] = [];
  loading = false;

  constructor(
    public mockData: MockDataService,
    private employeeService: EmployeeService,
    private taskService: TaskService,
    private taskAssignmentService: TaskAssignmentService
  ) {}

  ngOnInit(): void {
    this.loadReportsData();
  }

  loadReportsData(): void {
    this.loading = true;
    forkJoin({
      employees: this.employeeService.getEmployees(),
      tasks: this.taskService.getAllTasks(),
      assignments: this.taskAssignmentService.getAllAssignments()
    }).subscribe({
      next: ({ employees, tasks, assignments }) => {
        this.employees = employees || [];
        this.tasks = tasks || [];
        this.assignments = assignments || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load reports data', err);
        this.loading = false;
      }
    });
  }

  get totalTasksCount(): number {
    return this.tasks.length;
  }

  get pendingCount(): number {
    return this.assignments.filter((a) => a.status === 'Pending').length;
  }

  get inProgressCount(): number {
    return this.assignments.filter((a) => a.status === 'In Progress').length;
  }

  get completedCount(): number {
    return this.assignments.filter((a) => a.status === 'Completed').length;
  }

  get overdueCount(): number {
    return this.assignments.filter((a) => a.status === 'Overdue').length;
  }

  get employeePerformance(): EmployeePerformanceRow[] {
    return this.employees.map((emp) => {
      const empAssignments = this.assignments.filter((a) => a.employeeId === emp.employeeId);
      const assignedCount = empAssignments.length;
      const completedCount = empAssignments.filter((a) => a.status === 'Completed').length;
      const pendingCount = empAssignments.filter((a) => a.status === 'Pending' || a.status === 'In Progress').length;
      const overdueCount = empAssignments.filter((a) => a.status === 'Overdue').length;
      const completionRate = assignedCount > 0 ? Math.round((completedCount / assignedCount) * 100) : 0;

      return {
        employee: {
          employeeCode: emp.employeeCode || `EMP${emp.employeeId}`,
          name: emp.name,
          role: emp.role || 'Employee'
        },
        assignedCount,
        completedCount,
        pendingCount,
        overdueCount,
        completionRate
      };
    });
  }
}
