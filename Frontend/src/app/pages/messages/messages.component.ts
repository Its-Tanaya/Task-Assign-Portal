import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../core/services/mock-data.service';
import { AuthService } from '../../core/services/auth.service';
import { Employee } from '../../core/models/employee.model';
import { MessageItem } from '../../core/models/message.model';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss'
})
export class MessagesComponent {
  selectedRecipientId: number | null = 4; // Default to Jim Halpert
  newMessageText = '';

  constructor(
    public mockData: MockDataService,
    public authService: AuthService
  ) {}

  get currentUserId(): number {
    return this.authService.getUserId() || 1;
  }

  get otherEmployees(): Employee[] {
    return this.mockData.employees().filter((e) => e.userId !== this.currentUserId);
  }

  get selectedRecipient(): Employee | undefined {
    return this.mockData.employees().find((e) => e.userId === this.selectedRecipientId);
  }

  get activeThread(): MessageItem[] {
    if (!this.selectedRecipientId) return [];
    return this.mockData.messages().filter(
      (m) =>
        (m.senderId === this.currentUserId && m.receiverId === this.selectedRecipientId) ||
        (m.senderId === this.selectedRecipientId && m.receiverId === this.currentUserId)
    );
  }

  selectRecipient(userId: number): void {
    this.selectedRecipientId = userId;
    // Mark received messages as read
    this.mockData.messages().forEach((m) => {
      if (m.senderId === userId && m.receiverId === this.currentUserId && !m.isRead) {
        this.mockData.markMessageRead(m.messageId);
      }
    });
  }

  sendMessage(): void {
    if (!this.selectedRecipientId || !this.newMessageText.trim()) return;
    this.mockData.sendMessage(
      this.currentUserId,
      this.selectedRecipientId,
      this.newMessageText.trim()
    );
    this.newMessageText = '';
  }

  getUnreadCount(userId: number): number {
    return this.mockData
      .messages()
      .filter((m) => m.senderId === userId && m.receiverId === this.currentUserId && !m.isRead).length;
  }
}
