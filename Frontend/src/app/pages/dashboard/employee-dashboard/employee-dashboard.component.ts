import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { MockDataService } from '../../../core/services/mock-data.service';
import { EmployeeService } from '../../../services/employee.service';
import { TaskService } from '../../../services/task.service';
import { TaskAssignmentService } from '../../../services/task-assignment.service';
import { MessageService } from '../../../services/message.service';
import { Employee } from '../../../core/models/employee.model';
import { TaskItem } from '../../../core/models/task.model';
import { TaskAssignment } from '../../../core/models/task-assignment.model';
import { MessageItem } from '../../../core/models/message.model';

const DEPARTMENT_ID_TO_NAME: { [key: number]: string } = {
  1: 'IT',
  2: 'Human Resources',
  3: 'Management',
  4: 'Engineering',
  5: 'Finance',
  6: 'Sales'
};

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './employee-dashboard.component.html',
  styleUrl: './employee-dashboard.component.scss'
})
export class EmployeeDashboardComponent implements OnInit {
  currentEmployee: Employee | null = null;
  tasks: TaskItem[] = [];
  assignments: TaskAssignment[] = [];
  messages: MessageItem[] = [];
  loading = false;

  constructor(
    public authService: AuthService,
    public mockData: MockDataService,
    private employeeService: EmployeeService,
    private taskService: TaskService,
    private taskAssignmentService: TaskAssignmentService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  get user() {
    return this.authService.getUser();
  }

  loadDashboardData(): void {
    this.loading = true;
    const currentUserId = this.authService.getUserId() || 1;
    const currentUser = this.user;

    this.employeeService.getEmployees().subscribe({
      next: (empList) => {
        const normalized = (empList || []).map((e) => this.normalizeEmployee(e));

        const matched =
          normalized.find((e) => e.userId === currentUserId) ||
          normalized.find((e) => e.employeeId === currentUserId) ||
          (currentUser ? normalized.find((e) => e.name.toLowerCase() === currentUser.username.toLowerCase()) : null) ||
          normalized[0];

        if (matched) {
          this.currentEmployee = matched;
        } else if (currentUser) {
          this.currentEmployee = {
            employeeId: currentUser.userId,
            employeeCode: `EMP00${currentUser.userId}`,
            name: currentUser.username,
            email: `${currentUser.username.toLowerCase().replace(/\s+/g, '.')}@portal.com`,
            phone: 'N/A',
            department: 'IT',
            role: currentUser.role,
            salary: 45000,
            joiningDate: new Date().toISOString().split('T')[0],
            manager: 'Michael Scott',
            projectLead: 'Dwight Schrute',
            status: 'Active',
            userId: currentUser.userId
          };
        }

        if (this.currentEmployee) {
          const empId = this.currentEmployee.employeeId;

          this.taskAssignmentService.getAssignmentsByEmployee(empId).subscribe({
            next: (assList) => {
              this.assignments = (assList || []).map((a) => this.normalizeAssignment(a));
            },
            error: () => this.assignments = []
          });

          this.taskService.getAllTasks().subscribe({
            next: (taskList) => {
              this.tasks = (taskList || []).map((t) => this.normalizeTask(t));
            },
            error: () => this.tasks = []
          });

          this.messageService.getMessages(currentUserId).subscribe({
            next: (msgList) => {
              this.messages = (msgList || []).map((m) => this.normalizeMessage(m));
            },
            error: () => this.messages = []
          });
        }

        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load employee dashboard', err);
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
      phone: emp.phone || 'N/A',
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

  private normalizeMessage(m: any): MessageItem {
    let formattedTime = '';
    if (m.sentAt) {
      const d = new Date(m.sentAt);
      formattedTime = isNaN(d.getTime())
        ? m.sentAt.toString()
        : `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }

    return {
      messageId: m.messageId,
      senderId: m.senderId,
      receiverId: m.receiverId,
      taskId: m.taskId,
      messageText: m.messageText || '',
      sentAt: formattedTime,
      isRead: !!m.isRead
    };
  }

  get myAssignments() {
    return this.assignments
      .map((a) => {
        const task = this.tasks.find((t) => t.taskId === a.taskId);
        return {
          assignment: a,
          task: task!
        };
      })
      .filter((item) => !!item.task);
  }

  get myPendingCount(): number {
    return this.assignments.filter((a) => a.status === 'Pending').length;
  }

  get myInProgressCount(): number {
    return this.assignments.filter((a) => a.status === 'In Progress').length;
  }

  get myCompletedCount(): number {
    return this.assignments.filter((a) => a.status === 'Completed').length;
  }

  get myOverdueCount(): number {
    return this.assignments.filter((a) => a.status === 'Overdue').length;
  }

  get myRecentMessages() {
    return this.messages.slice(-3).reverse();
  }

  updateMyTaskStatus(assignmentId: number, event: Event): void {
    const select = event.target as HTMLSelectElement;
    const newStatus = select.value;
    if (newStatus && assignmentId) {
      this.taskAssignmentService.updateStatus(assignmentId, newStatus).subscribe({
        next: () => {
          if (this.currentEmployee) {
            this.taskAssignmentService.getAssignmentsByEmployee(this.currentEmployee.employeeId).subscribe({
              next: (assList) => {
                this.assignments = (assList || []).map((a) => this.normalizeAssignment(a));
              }
            });
          }
        },
        error: (err) => {
          console.error('Failed to update task status', err);
        }
      });
    }
  }
}
