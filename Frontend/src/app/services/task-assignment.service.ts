import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from './api.config';
import { TaskAssignment } from '../core/models/task-assignment.model';

@Injectable({
  providedIn: 'root'
})
export class TaskAssignmentService {
  private readonly apiUrl = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.taskAssignment}`;

  constructor(private http: HttpClient) {}

  getAllAssignments(): Observable<TaskAssignment[]> {
    return this.http.get<TaskAssignment[]>(this.apiUrl);
  }

  getAssignmentsByTask(taskId: number): Observable<TaskAssignment[]> {
    return this.http.get<TaskAssignment[]>(`${this.apiUrl}/task/${taskId}`);
  }

  getAssignmentsByEmployee(employeeId: number): Observable<TaskAssignment[]> {
    return this.http.get<TaskAssignment[]>(`${this.apiUrl}/employee/${employeeId}`);
  }

  assignTask(assignment: Partial<TaskAssignment>): Observable<any> {
    return this.http.post<any>(this.apiUrl, assignment);
  }

  updateStatus(id: number, status: string): Observable<any> {
    const params = new HttpParams().set('status', status);
    return this.http.put<any>(`${this.apiUrl}/${id}/status`, null, { params });
  }

  removeAssignment(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
