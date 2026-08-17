import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from './api.config';
import { Employee } from '../core/models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private readonly apiUrl = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.employee}`;

  constructor(private http: HttpClient) {}

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl);
  }

  getEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`);
  }

  addEmployee(employee: Partial<Employee>): Observable<any> {
    return this.http.post<any>(this.apiUrl, employee, { responseType: 'text' as 'json' });
  }

  updateEmployee(id: number, employee: Partial<Employee>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, employee, { responseType: 'text' as 'json' });
  }

  deleteEmployee(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { responseType: 'text' as 'json' });
  }
}