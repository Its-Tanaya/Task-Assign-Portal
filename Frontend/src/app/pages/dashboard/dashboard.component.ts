import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { MockDataService } from '../../core/services/mock-data.service';
import { EmployeeService } from '../../services/employee.service';
import { TaskService } from '../../services/task.service';
import { TaskAssignmentService } from '../../services/task-assignment.service';
import { Employee } from '../../core/models/employee.model';
import { TaskItem } from '../../core/models/task.model';
import { TaskAssignment } from '../../core/models/task-assignment.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  employees: Employee[] = [];
  tasks: TaskItem[] = [];
  assignments: TaskAssignment[] = [];
  loading = false;

  constructor(
    public authService: AuthService,
    public mockData: MockDataService,
    private employeeService: EmployeeService,
    private taskService: TaskService,
    private taskAssignmentService: TaskAssignmentService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
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
      error: () => {
        this.loading = false;
      }
    });
  }

  get user() {
    return this.authService.getUser();
  }

  get role() {
    return this.authService.getRole();
  }

  get totalEmployees(): number {
    return this.employees.length;
  }

  get totalTasks(): number {
    return this.tasks.length;
  }

  get pendingTasks(): number {
    return this.assignments.filter((a) => a.status === 'Pending').length;
  }

  get completedTasks(): number {
    return this.assignments.filter((a) => a.status === 'Completed').length;
  }

  get recentTasks() {
    return this.tasks.slice(0, 4).map((t) => {
      const ass = this.assignments.find((a) => a.taskId === t.taskId);
      return {
        ...t,
        status: ass ? ass.status : 'Unassigned'
      };
    });
  }
}
