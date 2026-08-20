import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { catchError, forkJoin, of } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { MessageService, MessageUser } from '../../services/message.service';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../core/models/employee.model';
import { MessageItem } from '../../core/models/message.model';

interface MessageRecipient {
  userId: number;
  name: string;
  role: string;
}

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

  employees: MessageRecipient[] = [];
  messages: MessageItem[] = [];

  constructor(
    public authService: AuthService,
    private messageService: MessageService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadMessages();
  }

  get currentUserId(): number {
    return this.authService.getUserId() || 1;
  }

  loadUsers(): void {
    forkJoin({
      users: this.messageService.getUsers(),
      employees: this.employeeService.getEmployees().pipe(catchError(() => of([] as Employee[])))
    }).subscribe({
      next: ({ users, employees }) => {
        this.employees = (users || [])
          .filter((user) => user.isActive && user.userId !== this.currentUserId)
          .map((user) => this.normalizeUser(user, employees));
        if (!this.selectedRecipientId && this.otherEmployees.length > 0) {
          this.selectRecipient(this.otherEmployees[0].userId);
        }
      },
      error: (err) => {
        console.error('Failed to load users for messaging', err);
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

  private normalizeUser(user: MessageUser, employees: Employee[]): MessageRecipient {
    const name = user.role === 'HR'
      ? 'HR'
      : user.role === 'Manager'
        ? 'Manager'
        : user.role === 'ProjectLead'
          ? 'Lead'
          : employees.find((employee) => employee.userId === user.userId)?.name || user.username;

    return {
      userId: user.userId,
      name,
      role: user.role
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

  get otherEmployees(): MessageRecipient[] {
    return this.employees;
  }

  get selectedRecipient(): MessageRecipient | undefined {
    return this.employees.find((emp) => emp.userId === this.selectedRecipientId);
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
