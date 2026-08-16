import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../core/services/mock-data.service';
import { AuthService } from '../../core/services/auth.service';
import { TaskItem } from '../../core/models/task.model';
import { TaskAssignment } from '../../core/models/task-assignment.model';
import { Employee } from '../../core/models/employee.model';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent {
  // Reactive filters using signals
  statusFilter = signal<string>('ALL');
  priorityFilter = signal<string>('ALL');

  showCreateModal = false;
  showDetailModal = false;

  selectedTask: TaskItem | null = null;
  selectedAssignment: TaskAssignment | null = null;

  // New task form fields
  newTaskTitle = '';
  newTaskDescription = '';
  newTaskPriority = 'Medium';
  newTaskStartDate = new Date().toISOString().split('T')[0];
  newTaskDeadline = new Date().toISOString().split('T')[0];

  // Employee Selection Checkboxes
  selectedEmployeeIds: { [empId: number]: boolean } = {};
  selectAll = false;

  priorities = ['Low', 'Medium', 'High', 'Critical'];
  statuses = ['Pending', 'In Progress', 'Completed', 'Overdue'];

  constructor(
    public mockData: MockDataService,
    public authService: AuthService
  ) {}

  // Computed Memoized Signals to Prevent Change Detection Loops
  allEmployees = computed(() => this.mockData.employees());

  currentRole = computed(() => this.authService.getRole() || 'Employee');
  currentUserId = computed(() => this.authService.getUserId() || 5);

  currentEmployee = computed(() => {
    const userId = this.currentUserId();
    return this.mockData.employees().find((e) => e.userId === userId);
  });

  isEmployeeRole = computed(() => this.currentRole() === 'Employee');

  canCreateTask = computed(() => {
    const role = this.currentRole();
    return role === 'HR' || role === 'Manager' || role === 'Project Lead';
  });

  // Memoized Task Rows Computation
  taskRows = computed(() => {
    const tasks = this.mockData.tasks();
    const assignments = this.mockData.assignments();
    const employees = this.mockData.employees();
    const currEmp = this.currentEmployee();
    const isEmp = this.isEmployeeRole();
    const sFilter = this.statusFilter();
    const pFilter = this.priorityFilter();

    let rows: Array<{
      task: TaskItem;
      assignment: TaskAssignment;
      assignedEmployee: Employee | null;
      status: string;
    }> = [];

    assignments.forEach((ass) => {
      const t = tasks.find((item) => item.taskId === ass.taskId);
      if (t) {
        const emp = employees.find((e) => e.employeeId === ass.employeeId) || null;
        rows.push({
          task: t,
          assignment: ass,
          assignedEmployee: emp,
          status: ass.status
        });
      }
    });

    // Filter strictly by current employeeId if in Employee role
    if (isEmp && currEmp) {
      rows = rows.filter((r) => r.assignment.employeeId === currEmp.employeeId);
    }

    // Apply Filter Dropdowns
    return rows.filter((row) => {
      const matchStatus = sFilter === 'ALL' || row.status === sFilter;
      const matchPriority = pFilter === 'ALL' || row.task.priority === pFilter;
      return matchStatus && matchPriority;
    });
  });

  onStatusFilterChange(val: string): void {
    this.statusFilter.set(val);
  }

  onPriorityFilterChange(val: string): void {
    this.priorityFilter.set(val);
  }

  initEmployeeSelection(): void {
    this.selectedEmployeeIds = {};
    this.selectAll = false;
    this.allEmployees().forEach((emp) => {
      this.selectedEmployeeIds[emp.employeeId] = false;
    });
  }

  toggleSelectAll(): void {
    this.allEmployees().forEach((emp) => {
      this.selectedEmployeeIds[emp.employeeId] = this.selectAll;
    });
  }

  onEmployeeCheckChange(): void {
    const emps = this.allEmployees();
    const allChecked = emps.length > 0 && emps.every((emp) => !!this.selectedEmployeeIds[emp.employeeId]);
    this.selectAll = allChecked;
  }

  openCreateModal(): void {
    this.newTaskTitle = '';
    this.newTaskDescription = '';
    this.newTaskPriority = 'Medium';
    this.newTaskStartDate = new Date().toISOString().split('T')[0];
    this.newTaskDeadline = new Date().toISOString().split('T')[0];
    this.initEmployeeSelection();
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
  }

  saveTask(): void {
    if (!this.newTaskTitle.trim()) return;

    const assignedEmpIds = Object.keys(this.selectedEmployeeIds)
      .map((id) => Number(id))
      .filter((id) => this.selectedEmployeeIds[id]);

    if (assignedEmpIds.length === 0) {
      alert('Please select at least one employee to receive this task.');
      return;
    }

    const createdTask = this.mockData.addTask({
      title: this.newTaskTitle.trim(),
      description: this.newTaskDescription.trim(),
      priority: this.newTaskPriority,
      startDate: this.newTaskStartDate,
      deadline: this.newTaskDeadline,
      createdBy: this.currentUserId()
    });

    this.mockData.assignTaskToMultiple(createdTask.taskId, assignedEmpIds);

    this.closeCreateModal();
  }

  updateStatus(assignmentId: number, event: Event): void {
    const select = event.target as HTMLSelectElement;
    if (select.value) {
      this.mockData.updateAssignmentStatus(assignmentId, select.value);
    }
  }

  openDetailModal(row: any): void {
    this.selectedTask = row.task;
    this.selectedAssignment = row.assignment;
    this.showDetailModal = true;
  }

  closeDetailModal(): void {
    this.showDetailModal = false;
    this.selectedTask = null;
    this.selectedAssignment = null;
  }
}
