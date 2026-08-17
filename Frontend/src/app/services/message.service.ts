import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from './api.config';
import { MessageItem } from '../core/models/message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private readonly apiUrl = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.message}`;

  constructor(private http: HttpClient) {}

  sendMessage(message: Partial<MessageItem>): Observable<any> {
    return this.http.post<any>(this.apiUrl, message);
  }

  getMessages(userId: number): Observable<MessageItem[]> {
    return this.http.get<MessageItem[]>(`${this.apiUrl}/${userId}`);
  }

  markAsRead(messageId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${messageId}/read`, null);
  }
}
