import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../core/services/mock-data.service';
import { AuthService } from '../../core/services/auth.service';
import { MessageService } from '../../services/message.service';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../core/models/employee.model';
import { MessageItem } from '../../core/models/message.model';

const DEPARTMENT_ID_TO_NAME: { [key: number]: string } = {
  1: 'IT',
  2: 'Human Resources',
  3: 'Management',
  4: 'Engineering',
  5: 'Finance',
  6: 'Sales'
};

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss'
})
export class MessagesComponent implements OnInit {
  selectedRecipientId: number | null = null;
  newMessageText = '';

  employees: Employee[] = [];
  messages: MessageItem[] = [];

  constructor(
    public mockData: MockDataService,
    public authService: AuthService,
    private messageService: MessageService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
    this.loadMessages();
  }

  get currentUserId(): number {
    return this.authService.getUserId() || 1;
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: (data) => {
        this.employees = (data || []).map((e) => this.normalizeEmployee(e));
        if (!this.selectedRecipientId && this.otherEmployees.length > 0) {
          this.selectRecipient(this.otherEmployees[0].userId);
        }
      },
      error: (err) => {
        console.error('Failed to load employees for messaging', err);
      }
    });
  }

  loadMessages(): void {
    this.messageService.getMessages(this.currentUserId).subscribe({
      next: (data) => {
        this.messages = (data || []).map((m) => this.normalizeMessage(m));
      },
      error: (err) => {
        console.error('Failed to load messages', err);
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

  get otherEmployees(): Employee[] {
    return this.employees.filter((emp) => emp.userId !== this.currentUserId && emp.employeeId !== this.currentUserId);
  }

  get selectedRecipient(): Employee | undefined {
    return this.employees.find((emp) => emp.userId === this.selectedRecipientId || emp.employeeId === this.selectedRecipientId);
  }

  get activeThread(): MessageItem[] {
    if (!this.selectedRecipientId) return [];

    return this.messages.filter(
      (m) =>
        (m.senderId === this.currentUserId && m.receiverId === this.selectedRecipientId) ||
        (m.senderId === this.selectedRecipientId && m.receiverId === this.currentUserId)
    );
  }

  selectRecipient(userId: number): void {
    this.selectedRecipientId = userId;

    // Mark unread messages from this sender as read
    const unreadMessages = this.messages.filter(
      (m) => m.senderId === userId && m.receiverId === this.currentUserId && !m.isRead
    );

    unreadMessages.forEach((m) => {
      this.messageService.markAsRead(m.messageId).subscribe({
        next: () => {
          m.isRead = true;
        }
      });
    });
  }

  sendMessage(): void {
    if (!this.selectedRecipientId || !this.newMessageText.trim()) return;

    const payload: Partial<MessageItem> = {
      senderId: this.currentUserId,
      receiverId: this.selectedRecipientId,
      messageText: this.newMessageText.trim(),
      sentAt: new Date().toISOString(),
      isRead: false
    };

    const text = this.newMessageText.trim();
    this.newMessageText = '';

    this.messageService.sendMessage(payload).subscribe({
      next: () => {
        this.loadMessages();
      },
      error: (err) => {
        console.error('Failed to send message', err);
        this.newMessageText = text;
      }
    });
  }

  getUnreadCount(userId: number): number {
    return this.messages.filter(
      (m) => m.senderId === userId && m.receiverId === this.currentUserId && !m.isRead
    ).length;
  }
}
