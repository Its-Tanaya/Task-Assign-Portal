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
  selectedRecipientId: number | null = null;
  newMessageText = '';

  constructor(
    public mockData: MockDataService,
    public authService: AuthService
  ) {}

  get currentUserId(): number {
    return this.authService.getUserId() || 1;
  }

  get otherEmployees(): Employee[] {
    return [];
  }

  get selectedRecipient(): Employee | undefined {
    return undefined;
  }

  get activeThread(): MessageItem[] {
    return [];
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
    this.newMessageText = '';
  }

  getUnreadCount(userId: number): number {
    return 0;
  }
}
