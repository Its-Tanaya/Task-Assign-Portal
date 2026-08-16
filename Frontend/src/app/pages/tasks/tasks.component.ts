import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../core/services/mock-data.service';
import { AuthService } from '../../core/services/auth.service';
import { TaskItem } from '../../core/models/task.model';
import { TaskAssignment } from '../../core/models/task-assignment.model';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent {
  statusFilter = 'ALL';
  priorityFilter = 'ALL';

  showCreateModal = false;
  showAssignModal = false;
  showDetailModal = false;

  selectedTask: TaskItem | null = null;
  selectedAssignment: TaskAssignment | null = null;

  // New task form
  newTask: Partial<TaskItem> = {
    title: '',
    description: '',
    priority: 'Medium',
    startDate: new Date().toISOString().split('T')[0],
    deadline: new Date().toISOString().split('T')[0]
  };

  // Assign form
  assignEmployeeId: number | null = null;

  priorities = ['Low', 'Medium', 'High', 'Critical'];
  statuses = ['Pending', 'In Progress', 'Completed', 'Overdue'];

  constructor(
    public mockData: MockDataService,
    public authService: AuthService
  ) {}

  get taskRows() {
    const tasks = this.mockData.tasks();
    const assignments = this.mockData.assignments();
    const employees = this.mockData.employees();

    return tasks.map((t) => {
      const ass = assignments.find((a) => a.taskId === t.taskId);
      const emp = ass ? employees.find((e) => e.employeeId === ass.employeeId) : null;
      return {
        task: t,
        assignment: ass || null,
        assignedEmployee: emp || null,
        status: ass ? ass.status : 'Unassigned'
      };
    }).filter((row) => {
      const matchStatus = this.statusFilter === 'ALL' || row.status === this.statusFilter;
      const matchPriority = this.priorityFilter === 'ALL' || row.task.priority === this.priorityFilter;
      return matchStatus && matchPriority;
    });
  }

  openCreateModal(): void {
    this.newTask = {
      title: '',
      description: '',
      priority: 'Medium',
      startDate: new Date().toISOString().split('T')[0],
      deadline: new Date().toISOString().split('T')[0]
    };
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
  }

  saveTask(): void {
    if (!this.newTask.title) return;
    this.mockData.addTask({
      ...this.newTask,
      createdBy: this.authService.getUserId() || 1
    });
    this.closeCreateModal();
  }

  openAssignModal(task: TaskItem): void {
    this.selectedTask = task;
    this.assignEmployeeId = null;
    this.showAssignModal = true;
  }

  closeAssignModal(): void {
    this.showAssignModal = false;
    this.selectedTask = null;
  }

  saveAssignment(): void {
    if (!this.selectedTask || !this.assignEmployeeId) return;
    this.mockData.assignTask(this.selectedTask.taskId, this.assignEmployeeId);
    this.closeAssignModal();
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
