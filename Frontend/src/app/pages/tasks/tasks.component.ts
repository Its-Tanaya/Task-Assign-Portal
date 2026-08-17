import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { MockDataService } from '../../core/services/mock-data.service';
import { AuthService } from '../../core/services/auth.service';
import { TaskService } from '../../services/task.service';
import { TaskAssignmentService } from '../../services/task-assignment.service';
import { EmployeeService } from '../../services/employee.service';
import { TaskItem } from '../../core/models/task.model';
import { TaskAssignment } from '../../core/models/task-assignment.model';
import { Employee } from '../../core/models/employee.model';

const DEPARTMENT_ID_TO_NAME: { [key: number]: string } = {
  1: 'IT',
  2: 'Human Resources',
  3: 'Management',
  4: 'Engineering',
  5: 'Finance',
  6: 'Sales'
};

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent implements OnInit {
  // Reactive signals for backend state
  tasks = signal<TaskItem[]>([]);
  assignments = signal<TaskAssignment[]>([]);
  employees = signal<Employee[]>([]);

  // Filter signals
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
    public authService: AuthService,
    private taskService: TaskService,
    private taskAssignmentService: TaskAssignmentService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData(): void {
    this.employeeService.getEmployees().subscribe({
      next: (empList) => {
        const normalizedEmps = (empList || []).map((e) => this.normalizeEmployee(e));
        this.employees.set(normalizedEmps);

        this.taskService.getAllTasks().subscribe({
          next: (taskList) => {
            const normalizedTasks = (taskList || []).map((t) => this.normalizeTask(t));
            this.tasks.set(normalizedTasks);

            const isEmp = this.isEmployeeRole();
            const currEmp = this.currentEmployee();

            if (isEmp && currEmp) {
              this.taskAssignmentService.getAssignmentsByEmployee(currEmp.employeeId).subscribe({
                next: (assList) => {
                  this.assignments.set((assList || []).map((a) => this.normalizeAssignment(a)));
                },
                error: () => this.assignments.set([])
              });
            } else {
              this.taskAssignmentService.getAllAssignments().subscribe({
                next: (assList) => {
                  this.assignments.set((assList || []).map((a) => this.normalizeAssignment(a)));
                },
                error: () => this.assignments.set([])
              });
            }
          },
          error: () => this.tasks.set([])
        });
      },
      error: () => this.employees.set([])
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
      userId: emp.userId || 0,
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

  // Computed signals
  allEmployees = computed(() => this.employees());

  currentRole = computed(() => this.authService.getRole() || 'Employee');
  currentUserId = computed(() => this.authService.getUserId() || 1);

  currentEmployee = computed(() => {
    const userId = this.currentUserId();
    const emps = this.employees();
    return emps.find((e) => e.userId === userId) || emps.find((e) => e.employeeId === userId) || emps[0] || null;
  });

  isEmployeeRole = computed(() => this.currentRole() === 'Employee');

  canCreateTask = computed(() => {
    const role = this.currentRole();
    return role === 'HR' || role === 'Manager' || role === 'Project Lead';
  });

  // Memoized Task Rows Computation
  taskRows = computed(() => {
    const tasks = this.tasks();
    const assignments = this.assignments();
    const employees = this.employees();
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

    // If Employee role, only show assignments matching current employee
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

    const newTaskPayload: Partial<TaskItem> = {
      title: this.newTaskTitle.trim(),
      description: this.newTaskDescription.trim(),
      priority: this.newTaskPriority,
      startDate: this.newTaskStartDate ? new Date(this.newTaskStartDate).toISOString() : new Date().toISOString(),
      deadline: this.newTaskDeadline ? new Date(this.newTaskDeadline).toISOString() : new Date().toISOString(),
      createdBy: this.currentUserId(),
      createdDate: new Date().toISOString(),
      isActive: true
    };

    this.taskService.addTask(newTaskPayload).subscribe({
      next: () => {
        // Fetch tasks to find the newly created task's ID
        this.taskService.getAllTasks().subscribe({
          next: (taskList) => {
            const createdTask = taskList.reduce((max, t) => (t.taskId > (max?.taskId || 0) ? t : max), taskList[0]);
            if (createdTask && assignedEmpIds.length > 0) {
              const assignRequests = assignedEmpIds.map((empId) =>
                this.taskAssignmentService.assignTask({
                  taskId: createdTask.taskId,
                  employeeId: empId,
                  status: 'Pending',
                  assignedDate: new Date().toISOString()
                })
              );

              forkJoin(assignRequests).subscribe({
                next: () => {
                  this.loadAllData();
                  this.closeCreateModal();
                },
                error: () => {
                  this.loadAllData();
                  this.closeCreateModal();
                }
              });
            } else {
              this.loadAllData();
              this.closeCreateModal();
            }
          },
          error: () => {
            this.loadAllData();
            this.closeCreateModal();
          }
        });
      },
      error: (err) => {
        console.error('Failed to create task', err);
      }
    });
  }

  updateStatus(assignmentId: number, event: Event): void {
    const select = event.target as HTMLSelectElement;
    const newStatus = select.value;
    if (newStatus && assignmentId) {
      this.taskAssignmentService.updateStatus(assignmentId, newStatus).subscribe({
        next: () => {
          this.loadAllData();
        },
        error: (err) => {
          console.error('Failed to update assignment status', err);
        }
      });
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
