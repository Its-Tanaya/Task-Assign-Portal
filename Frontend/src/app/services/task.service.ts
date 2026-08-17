import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from './api.config';
import { TaskItem } from '../core/models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly apiUrl = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.task}`;

  constructor(private http: HttpClient) {}

  getAllTasks(): Observable<TaskItem[]> {
    return this.http.get<TaskItem[]>(this.apiUrl);
  }

  getTaskById(id: number): Observable<TaskItem> {
    return this.http.get<TaskItem>(`${this.apiUrl}/${id}`);
  }

  addTask(task: Partial<TaskItem>): Observable<any> {
    return this.http.post<any>(this.apiUrl, task, { responseType: 'text' as 'json' });
  }

  updateTask(id: number, task: Partial<TaskItem>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, task, { responseType: 'text' as 'json' });
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { responseType: 'text' as 'json' });
  }
}
