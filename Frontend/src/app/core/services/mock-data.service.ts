import { Injectable, signal } from '@angular/core';
import { Employee } from '../models/employee.model';
import { TaskItem } from '../models/task.model';
import { TaskAssignment } from '../models/task-assignment.model';
import { SalaryHistory } from '../models/salary-history.model';
import { MessageItem } from '../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  // Mock Employees
  employees = signal<Employee[]>([
    {
      employeeId: 1,
      employeeCode: 'EMP001',
      name: 'Sarah Jenkins',
      email: 'sarah.jenkins@portal.com',
      phone: '+1 555-0192',
      departmentId: 1,
      role: 'HR',
      salary: 75000,
      joiningDate: '2023-01-15',
      userId: 1,
      isActive: true
    },
    {
      employeeId: 2,
      employeeCode: 'EMP002',
      name: 'Michael Scott',
      email: 'michael.scott@portal.com',
      phone: '+1 555-0143',
      departmentId: 2,
      role: 'Manager',
      salary: 92000,
      joiningDate: '2022-05-10',
      userId: 2,
      isActive: true
    },
    {
      employeeId: 3,
      employeeCode: 'EMP003',
      name: 'David Wallace',
      email: 'david.wallace@portal.com',
      phone: '+1 555-0188',
      departmentId: 2,
      role: 'Project Lead',
      salary: 84000,
      joiningDate: '2022-09-01',
      managerId: 2,
      userId: 3,
      isActive: true
    },
    {
      employeeId: 4,
      employeeCode: 'EMP004',
      name: 'Jim Halpert',
      email: 'jim.halpert@portal.com',
      phone: '+1 555-0177',
      departmentId: 2,
      role: 'Employee',
      salary: 62000,
      joiningDate: '2023-03-20',
      managerId: 2,
      projectLeadId: 3,
      userId: 4,
      isActive: true
    },
    {
      employeeId: 5,
      employeeCode: 'EMP005',
      name: 'Pam Beesly',
      email: 'pam.beesly@portal.com',
      phone: '+1 555-0166',
      departmentId: 1,
      role: 'Employee',
      salary: 58000,
      joiningDate: '2023-06-12',
      managerId: 2,
      userId: 5,
      isActive: true
    },
    {
      employeeId: 6,
      employeeCode: 'EMP006',
      name: 'Dwight Schrute',
      email: 'dwight.schrute@portal.com',
      phone: '+1 555-0155',
      departmentId: 2,
      role: 'Employee',
      salary: 68000,
      joiningDate: '2022-11-05',
      managerId: 2,
      projectLeadId: 3,
      userId: 6,
      isActive: true
    }
  ]);

  // Mock Tasks
  tasks = signal<TaskItem[]>([
    {
      taskId: 101,
      title: 'Setup Core Database Schema & Migrations',
      description: 'Design relational tables for Employees, Tasks, Assignments and Salary History.',
      createdBy: 2,
      startDate: '2026-08-01',
      deadline: '2026-08-15',
      priority: 'High',
      createdDate: '2026-08-01',
      isActive: true
    },
    {
      taskId: 102,
      title: 'Implement Angular 17 UI Dashboards',
      description: 'Build standalone SCSS dashboards for HR, Manager, Lead, and Employees.',
      createdBy: 3,
      startDate: '2026-08-10',
      deadline: '2026-08-20',
      priority: 'Critical',
      createdDate: '2026-08-10',
      isActive: true
    },
    {
      taskId: 103,
      title: 'Conduct Quarter 3 Employee Performance Review',
      description: 'Evaluate Q3 KPIs and update salary recommendations.',
      createdBy: 1,
      startDate: '2026-08-05',
      deadline: '2026-08-25',
      priority: 'Medium',
      createdDate: '2026-08-05',
      isActive: true
    },
    {
      taskId: 104,
      title: 'Fix Messaging API Timeout Issues',
      description: 'Investigate message query latency and optimize DB index.',
      createdBy: 3,
      startDate: '2026-08-02',
      deadline: '2026-08-12',
      priority: 'High',
      createdDate: '2026-08-02',
      isActive: true
    }
  ]);

  // Mock Task Assignments
  assignments = signal<TaskAssignment[]>([
    {
      taskAssignmentId: 201,
      taskId: 101,
      employeeId: 4,
      status: 'Completed',
      assignedDate: '2026-08-01',
      completedOn: '2026-08-14'
    },
    {
      taskAssignmentId: 202,
      taskId: 102,
      employeeId: 4,
      status: 'In Progress',
      assignedDate: '2026-08-10'
    },
    {
      taskAssignmentId: 203,
      taskId: 103,
      employeeId: 5,
      status: 'Pending',
      assignedDate: '2026-08-05'
    },
    {
      taskAssignmentId: 204,
      taskId: 104,
      employeeId: 6,
      status: 'Overdue',
      assignedDate: '2026-08-02'
    }
  ]);

  // Mock Salary History
  salaryHistory = signal<SalaryHistory[]>([
    {
      salaryHistoryId: 301,
      employeeId: 4,
      oldSalary: 55000,
      newSalary: 62000,
      changeAmount: 7000,
      changedBy: 1,
      changedAt: '2026-01-10',
      reason: 'Annual Performance Appraisal Bonus'
    },
    {
      salaryHistoryId: 302,
      employeeId: 2,
      oldSalary: 85000,
      newSalary: 92000,
      changeAmount: 7000,
      changedBy: 1,
      changedAt: '2025-12-01',
      reason: 'Promotion to Manager'
    }
  ]);

  // Mock Messages
  messages = signal<MessageItem[]>([
    {
      messageId: 401,
      senderId: 2,
      receiverId: 4,
      taskId: 102,
      messageText: 'Hi Jim, please update the status of the Angular UI task when ready.',
      sentAt: '2026-08-16 10:30 AM',
      isRead: true
    },
    {
      messageId: 402,
      senderId: 4,
      receiverId: 2,
      taskId: 102,
      messageText: 'Sure Michael, working on the standalone components now!',
      sentAt: '2026-08-16 10:45 AM',
      isRead: false
    },
    {
      messageId: 403,
      senderId: 1,
      receiverId: 4,
      messageText: 'Hello Jim, your annual appraisal document is ready in HR.',
      sentAt: '2026-08-15 02:15 PM',
      isRead: true
    }
  ]);

  // CRUD Operations for Mock Data

  // Employees
  addEmployee(emp: Partial<Employee>): void {
    const newId = Math.max(...this.employees().map((e) => e.employeeId), 0) + 1;
    const newEmp: Employee = {
      employeeId: newId,
      employeeCode: `EMP00${newId}`,
      name: emp.name || 'New Employee',
      email: emp.email || 'employee@portal.com',
      phone: emp.phone || '+1 555-0000',
      departmentId: Number(emp.departmentId) || 1,
      role: emp.role || 'Employee',
      salary: Number(emp.salary) || 50000,
      joiningDate: emp.joiningDate || new Date().toISOString().split('T')[0],
      userId: newId,
      isActive: true
    };
    this.employees.update((list) => [...list, newEmp]);
  }

  updateEmployee(updated: Employee): void {
    this.employees.update((list) =>
      list.map((e) => (e.employeeId === updated.employeeId ? updated : e))
    );
  }

  deleteEmployee(id: number): void {
    this.employees.update((list) => list.filter((e) => e.employeeId !== id));
  }

  // Tasks
  addTask(task: Partial<TaskItem>): void {
    const newId = Math.max(...this.tasks().map((t) => t.taskId), 100) + 1;
    const newTask: TaskItem = {
      taskId: newId,
      title: task.title || 'New Task',
      description: task.description || '',
      createdBy: task.createdBy || 1,
      startDate: task.startDate || new Date().toISOString().split('T')[0],
      deadline: task.deadline || new Date().toISOString().split('T')[0],
      priority: task.priority || 'Medium',
      createdDate: new Date().toISOString().split('T')[0],
      isActive: true
    };
    this.tasks.update((list) => [...list, newTask]);
  }

  // Task Assignment
  assignTask(taskId: number, employeeId: number): void {
    const newId = Math.max(...this.assignments().map((a) => a.taskAssignmentId), 200) + 1;
    const newAssignment: TaskAssignment = {
      taskAssignmentId: newId,
      taskId: Number(taskId),
      employeeId: Number(employeeId),
      status: 'Pending',
      assignedDate: new Date().toISOString().split('T')[0]
    };
    this.assignments.update((list) => [...list, newAssignment]);
  }

  updateAssignmentStatus(assignmentId: number, status: string): void {
    this.assignments.update((list) =>
      list.map((a) => {
        if (a.taskAssignmentId === assignmentId) {
          return {
            ...a,
            status,
            completedOn: status === 'Completed' ? new Date().toISOString().split('T')[0] : a.completedOn
          };
        }
        return a;
      })
    );
  }

  // Salary
  updateSalary(employeeId: number, newSalary: number, changedBy: number, reason: string): void {
    const emp = this.employees().find((e) => e.employeeId === employeeId);
    if (!emp) return;

    const oldSalary = emp.salary;
    const changeAmount = newSalary - oldSalary;

    // Update employee salary
    this.employees.update((list) =>
      list.map((e) => (e.employeeId === employeeId ? { ...e, salary: newSalary } : e))
    );

    // Add audit history
    const historyId = Math.max(...this.salaryHistory().map((h) => h.salaryHistoryId), 300) + 1;
    const historyEntry: SalaryHistory = {
      salaryHistoryId: historyId,
      employeeId,
      oldSalary,
      newSalary,
      changeAmount,
      changedBy,
      changedAt: new Date().toISOString().split('T')[0],
      reason
    };
    this.salaryHistory.update((list) => [historyEntry, ...list]);
  }

  // Messages
  sendMessage(senderId: number, receiverId: number, text: string, taskId?: number): void {
    const newId = Math.max(...this.messages().map((m) => m.messageId), 400) + 1;
    const newMsg: MessageItem = {
      messageId: newId,
      senderId: Number(senderId),
      receiverId: Number(receiverId),
      taskId: taskId ? Number(taskId) : undefined,
      messageText: text,
      sentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false
    };
    this.messages.update((list) => [...list, newMsg]);
  }

  markMessageRead(messageId: number): void {
    this.messages.update((list) =>
      list.map((m) => (m.messageId === messageId ? { ...m, isRead: true } : m))
    );
  }
}
