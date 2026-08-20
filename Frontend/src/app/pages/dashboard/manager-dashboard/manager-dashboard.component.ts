import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { MockDataService } from '../../../core/services/mock-data.service';
import { EmployeeService } from '../../../services/employee.service';
import { TaskService } from '../../../services/task.service';
import { TaskAssignmentService } from '../../../services/task-assignment.service';
import { Employee } from '../../../core/models/employee.model';
import { TaskItem } from '../../../core/models/task.model';
import { TaskAssignment } from '../../../core/models/task-assignment.model';

const DEPARTMENT_ID_TO_NAME: { [key: number]: string } = {
  1: 'IT',
  2: 'Human Resources',
  3: 'Management',
  4: 'Engineering',
  5: 'Finance',
  6: 'Sales'
};

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './manager-dashboard.component.html',
  styleUrl: './manager-dashboard.component.scss'
})
export class ManagerDashboardComponent implements OnInit {
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
        this.employees = (employees || []).map((e) => this.normalizeEmployee(e));
        this.tasks = (tasks || []).map((t) => this.normalizeTask(t));
        this.assignments = (assignments || []).map((a) => this.normalizeAssignment(a));
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load Manager dashboard data', err);
        this.loading = false;
      }
    });
  }

  private normalizeEmployee(emp: any): Employee {
    return {
      employeeId: emp.employeeId,
      employeeCode: emp.employeeCode || `EMP${emp.employeeId}`,
      name: emp.name || '',
      email: emp.email || '',
      phone: emp.phone || '',
      department: emp.department || (emp.departmentId ? DEPARTMENT_ID_TO_NAME[emp.departmentId] : 'IT') || 'IT',
      departmentId: emp.departmentId || 1,
      role: emp.role || 'Employee',
      salary: emp.salary || 0,
      joiningDate: emp.joiningDate ? emp.joiningDate.toString().split('T')[0] : '',
      manager: emp.manager || 'Michael Scott',
      projectLead: emp.projectLead || 'Dwight Schrute',
      status: (emp.status || (emp.isActive !== false ? 'Active' : 'Inactive')) as 'Active' | 'Inactive',
      userId: emp.userId || emp.employeeId,
      isActive: emp.isActive
    };
  }

  private normalizeTask(t: any): TaskItem {
    return {
      taskId: t.taskId,
      title: t.title || '',
      description: t.description || '',
      createdBy: t.createdBy || 1,
      startDate: t.startDate ? t.startDate.toString().split('T')[0] : '',
      deadline: t.deadline ? t.deadline.toString().split('T')[0] : '',
      priority: t.priority || 'Medium',
      createdDate: t.createdDate ? t.createdDate.toString().split('T')[0] : '',
      isActive: t.isActive
    };
  }

  private normalizeAssignment(a: any): TaskAssignment {
    return {
      taskAssignmentId: a.taskAssignmentId,
      taskId: a.taskId,
      employeeId: a.employeeId,
      status: a.status || 'Pending',
      assignedDate: a.assignedDate ? a.assignedDate.toString().split('T')[0] : '',
      completedOn: a.completedOn ? a.completedOn.toString().split('T')[0] : undefined
    };
  }

  get user() {
    return this.authService.getUser();
  }

  get teamMembersCount(): number {
    return this.employees.length;
  }

  get totalTeamTasks(): number {
    return this.tasks.length;
  }

  get pendingTasks(): number {
    return this.assignments.filter((a) => a.status === 'Pending').length;
  }

  get inProgressTasks(): number {
    return this.assignments.filter((a) => a.status === 'In Progress').length;
  }

  get completedTasks(): number {
    return this.assignments.filter((a) => a.status === 'Completed').length;
  }

  get overdueTasks(): number {
    return this.assignments.filter((a) => a.status === 'Overdue').length;
  }

  get teamTaskRows() {
    return this.tasks.filter((t) => {
      const ass = this.assignments.find((a) => a.taskId === t.taskId);
      return this.isTaskVisible(t, ass?.status || 'Unassigned');
    }).map((t) => {
      const ass = this.assignments.find((a) => a.taskId === t.taskId);
      const emp = ass ? this.employees.find((e) => e.employeeId === ass.employeeId) : null;
      return {
        task: t,
        assignee: emp ? emp.name : 'Unassigned',
        status: ass ? ass.status : 'Unassigned'
      };
    });
  }

  private isTaskVisible(task: TaskItem, status: string): boolean {
    if (status !== 'Completed' || !task.deadline) return true;

    const [year, month, day] = task.deadline.split('-').map(Number);
    const deadline = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return deadline >= today;
  }
}
