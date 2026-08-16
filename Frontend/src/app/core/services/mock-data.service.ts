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
  // Mock Employees List
  employees = signal<Employee[]>([
    {
      employeeId: 1,
      employeeCode: 'EMP001',
      name: 'Rahul Patil',
      email: 'rahul.patil@portal.com',
      phone: '+91 98765 43210',
      department: 'IT',
      departmentId: 1,
      role: 'Backend Developer',
      salary: 40000,
      joiningDate: '2023-01-15',
      manager: 'Michael Scott',
      projectLead: 'Dwight Schrute',
      status: 'Active',
      userId: 5
    },
    {
      employeeId: 2,
      employeeCode: 'EMP002',
      name: 'Sarah Jenkins',
      email: 'sarah.jenkins@portal.com',
      phone: '+1 555-0192',
      department: 'Human Resources',
      departmentId: 2,
      role: 'HR',
      salary: 75000,
      joiningDate: '2021-03-10',
      manager: 'Corporate Board',
      projectLead: 'N/A',
      status: 'Active',
      userId: 1
    },
    {
      employeeId: 3,
      employeeCode: 'EMP003',
      name: 'Michael Scott',
      email: 'michael.scott@portal.com',
      phone: '+1 555-0144',
      department: 'Management',
      departmentId: 3,
      role: 'Manager',
      salary: 85000,
      joiningDate: '2018-06-01',
      manager: 'Corporate Board',
      projectLead: 'N/A',
      status: 'Active',
      userId: 2
    },
    {
      employeeId: 4,
      employeeCode: 'EMP004',
      name: 'Dwight Schrute',
      email: 'dwight.schrute@portal.com',
      phone: '+1 555-0188',
      department: 'Engineering',
      departmentId: 1,
      role: 'Project Lead',
      salary: 72000,
      joiningDate: '2019-09-12',
      manager: 'Michael Scott',
      projectLead: 'Dwight Schrute',
      status: 'Active',
      userId: 3
    },
    {
      employeeId: 5,
      employeeCode: 'EMP005',
      name: 'Jim Halpert',
      email: 'jim.halpert@portal.com',
      phone: '+1 555-0177',
      department: 'Engineering',
      departmentId: 1,
      role: 'Frontend Developer',
      salary: 62000,
      joiningDate: '2020-02-18',
      manager: 'Michael Scott',
      projectLead: 'Dwight Schrute',
      status: 'Active',
      userId: 4
    },
    {
      employeeId: 6,
      employeeCode: 'EMP006',
      name: 'Pam Beesly',
      email: 'pam.beesly@portal.com',
      phone: '+1 555-0133',
      department: 'Human Resources',
      departmentId: 2,
      role: 'HR Specialist',
      salary: 52000,
      joiningDate: '2021-11-05',
      manager: 'Sarah Jenkins',
      projectLead: 'N/A',
      status: 'Active',
      userId: 6
    },
    {
      employeeId: 7,
      employeeCode: 'EMP007',
      name: 'Ramesh Sharma',
      email: 'ramesh.sharma@portal.com',
      phone: '+91 91234 56789',
      department: 'IT',
      departmentId: 1,
      role: 'QA Engineer',
      salary: 45000,
      joiningDate: '2022-08-20',
      manager: 'Michael Scott',
      projectLead: 'Dwight Schrute',
      status: 'Inactive',
      userId: 7
    }
  ]);

  // Mock Tasks List
  tasks = signal<TaskItem[]>([
    {
      taskId: 101,
      title: 'Design Angular Dashboard Layout',
      description: 'Create responsive standalone navigation, topbar, and role-based summary metrics.',
      priority: 'High',
      startDate: '2026-03-01',
      deadline: '2026-03-20',
      createdBy: 1,
      createdDate: '2026-03-01',
      isActive: true
    },
    {
      taskId: 102,
      title: 'Implement Employee Management Module',
      description: 'Build Employee table, Add/Edit forms, detail profile card views, and search filters.',
      priority: 'Critical',
      startDate: '2026-03-05',
      deadline: '2026-03-25',
      createdBy: 2,
      createdDate: '2026-03-05',
      isActive: true
    },
    {
      taskId: 103,
      title: 'Configure Salary History Log',
      description: 'Audit compensation updates and generate employee salary change logs.',
      priority: 'Medium',
      startDate: '2026-03-10',
      deadline: '2026-03-28',
      createdBy: 2,
      createdDate: '2026-03-10',
      isActive: true
    },
    {
      taskId: 104,
      title: 'Direct Messaging System UI',
      description: 'Real-time mock direct chat inbox and employee thread filter.',
      priority: 'Low',
      startDate: '2026-03-12',
      deadline: '2026-03-30',
      createdBy: 3,
      createdDate: '2026-03-12',
      isActive: true
    }
  ]);

  // Mock Task Assignments List
  assignments = signal<TaskAssignment[]>([
    { taskAssignmentId: 1, taskId: 101, employeeId: 4, status: 'In Progress', assignedDate: '2026-03-01' },
    { taskAssignmentId: 2, taskId: 102, employeeId: 1, status: 'Pending', assignedDate: '2026-03-05' },
    { taskAssignmentId: 3, taskId: 103, employeeId: 2, status: 'Completed', assignedDate: '2026-03-10', completedOn: '2026-03-11' },
    { taskAssignmentId: 4, taskId: 104, employeeId: 5, status: 'In Progress', assignedDate: '2026-03-12' }
  ]);

  // Mock Salary History Log
  salaryHistory = signal<SalaryHistory[]>([
    { salaryHistoryId: 1, employeeId: 1, oldSalary: 35000, newSalary: 40000, changeAmount: 5000, changedBy: 1, changedAt: '2026-01-10', reason: 'Annual Appraisal' },
    { salaryHistoryId: 2, employeeId: 4, oldSalary: 68000, newSalary: 72000, changeAmount: 4000, changedBy: 1, changedAt: '2026-02-01', reason: 'Performance Promotion' }
  ]);

  // Mock Messages List
  messages = signal<MessageItem[]>([
    { messageId: 1, senderId: 1, receiverId: 4, messageText: 'Hi Dwight, please review the sprint task priorities.', sentAt: '2026-03-11 10:30 AM', isRead: true },
    { messageId: 2, senderId: 4, receiverId: 1, messageText: 'Sure Sarah, checking task assignments now.', sentAt: '2026-03-11 10:35 AM', isRead: true },
    { messageId: 3, senderId: 2, receiverId: 5, messageText: 'Jim, please update task #104 status.', sentAt: '2026-03-12 02:15 PM', isRead: false }
  ]);

  constructor() {}

  // Employee Helper Methods
  getEmployeeById(id: number): Employee | undefined {
    return this.employees().find((e) => e.employeeId === id);
  }

  getEmployeeByUserId(userId: number): Employee | undefined {
    return this.employees().find((e) => e.userId === userId);
  }

  addEmployee(emp: Partial<Employee>): Employee {
    const current = this.employees();
    const newId = current.length > 0 ? Math.max(...current.map((e) => e.employeeId)) + 1 : 1;
    const empCode = emp.employeeCode || `EMP${String(newId).padStart(3, '0')}`;

    const newEmp: Employee = {
      employeeId: newId,
      employeeCode: empCode,
      name: emp.name || 'New Employee',
      email: emp.email || '',
      phone: emp.phone || '',
      department: emp.department || 'IT',
      departmentId: emp.departmentId || 1,
      role: emp.role || 'Software Engineer',
      salary: emp.salary || 40000,
      joiningDate: emp.joiningDate || new Date().toISOString().split('T')[0],
      manager: emp.manager || 'Michael Scott',
      projectLead: emp.projectLead || 'Dwight Schrute',
      status: emp.status || 'Active',
      userId: emp.userId || newId + 10
    };

    this.employees.set([...current, newEmp]);
    return newEmp;
  }

  updateEmployee(updated: Employee): void {
    const current = this.employees();
    const index = current.findIndex((e) => e.employeeId === updated.employeeId);
    if (index !== -1) {
      const list = [...current];
      list[index] = updated;
      this.employees.set(list);
    }
  }

  deleteEmployee(id: number): void {
    this.employees.set(this.employees().filter((e) => e.employeeId !== id));
  }

  // Task & Assignment Helpers
  addTask(task: Partial<TaskItem>): TaskItem {
    const current = this.tasks();
    const newId = current.length > 0 ? Math.max(...current.map((t) => t.taskId)) + 1 : 101;
    const newTask: TaskItem = {
      taskId: newId,
      title: task.title || 'Untitled Task',
      description: task.description || '',
      priority: task.priority || 'Medium',
      startDate: task.startDate || new Date().toISOString().split('T')[0],
      deadline: task.deadline || new Date().toISOString().split('T')[0],
      createdBy: task.createdBy || 1,
      createdDate: new Date().toISOString().split('T')[0],
      isActive: true
    };
    this.tasks.set([...current, newTask]);
    return newTask;
  }

  assignTaskToMultiple(taskId: number, employeeIds: number[]): void {
    const current = [...this.assignments()];
    const today = new Date().toISOString().split('T')[0];

    employeeIds.forEach((empId) => {
      const newAssignId = current.length > 0 ? Math.max(...current.map((a) => a.taskAssignmentId)) + 1 : 1;
      current.push({
        taskAssignmentId: newAssignId,
        taskId,
        employeeId: empId,
        status: 'Pending',
        assignedDate: today
      });
    });

    this.assignments.set(current);
  }

  updateAssignmentStatus(taskAssignmentId: number, status: string): void {
    const list = [...this.assignments()];
    const target = list.find((a) => a.taskAssignmentId === taskAssignmentId);
    if (target) {
      target.status = status;
      if (status === 'Completed') {
        target.completedOn = new Date().toISOString().split('T')[0];
      } else {
        delete target.completedOn;
      }
      this.assignments.set(list);
    }
  }

  // Salary Helpers
  updateSalary(employeeId: number, newSalary: number, changedBy: number, reason: string): void {
    const emp = this.getEmployeeById(employeeId);
    if (!emp) return;

    const oldSalary = emp.salary;
    emp.salary = newSalary;
    this.updateEmployee(emp);

    const history = this.salaryHistory();
    const newHistId = history.length > 0 ? Math.max(...history.map((h) => h.salaryHistoryId)) + 1 : 1;
    this.salaryHistory.set([
      ...history,
      {
        salaryHistoryId: newHistId,
        employeeId,
        oldSalary,
        newSalary,
        changeAmount: newSalary - oldSalary,
        changedBy,
        changedAt: new Date().toISOString().split('T')[0],
        reason
      }
    ]);
  }

  // Message Helpers
  sendMessage(senderId: number, receiverId: number, messageText: string): void {
    const list = this.messages();
    const newMsgId = list.length > 0 ? Math.max(...list.map((m) => m.messageId)) + 1 : 1;
    const now = new Date();
    const timeStr = now.toLocaleDateString() + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    this.messages.set([
      ...list,
      {
        messageId: newMsgId,
        senderId,
        receiverId,
        messageText,
        sentAt: timeStr,
        isRead: false
      }
    ]);
  }

  markMessageRead(messageId: number): void {
    const list = [...this.messages()];
    const msg = list.find((m) => m.messageId === messageId);
    if (msg) {
      msg.isRead = true;
      this.messages.set(list);
    }
  }
}
