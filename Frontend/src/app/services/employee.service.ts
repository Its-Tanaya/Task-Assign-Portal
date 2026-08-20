import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { API_CONFIG } from './api.config';
import { CreateEmployee, Employee } from '../core/models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private readonly apiUrl = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.employee}`;

  constructor(private http: HttpClient) {}

  getEmployees(): Observable<Employee[]> {
    console.log('[EmployeeService] Sending GET request to:', this.apiUrl);
    return this.http.get<Employee[]>(this.apiUrl).pipe(
      tap(response => {
        console.log('[EmployeeService] GET response received. Employee count:', response?.length);
      })
    );
  }

  getEmployeeById(id: number): Observable<Employee> {
    const url = `${this.apiUrl}/${id}`;
    console.log('[EmployeeService] Sending GET request to:', url);
    return this.http.get<Employee>(url).pipe(
      tap(response => {
        console.log('[EmployeeService] GET by ID response received:', response);
      })
    );
  }

  addEmployee(employee: CreateEmployee): Observable<any> {
    console.log('[EmployeeService] Sending POST request to:', this.apiUrl);
    console.log('[EmployeeService] Payload:', employee);
    return this.http.post<any>(this.apiUrl, employee, { responseType: 'text' as 'json' }).pipe(
      tap(response => {
        console.log('[EmployeeService] POST response received:', response);
      })
    );
  }

  updateEmployee(id: number, employee: Partial<Employee>): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    console.log('[EmployeeService] Sending PUT request to:', url);
    console.log('[EmployeeService] Payload:', employee);
    return this.http.put<any>(url, employee, { responseType: 'text' as 'json' }).pipe(
      tap(response => {
        console.log('[EmployeeService] PUT response received:', response);
      })
    );
  }

  deleteEmployee(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    console.log('[EmployeeService] Sending DELETE request to:', url);
    return this.http.delete<any>(url, { responseType: 'text' as 'json' }).pipe(
      tap(response => {
        console.log('[EmployeeService] DELETE response received:', response);
      })
    );
  }
}