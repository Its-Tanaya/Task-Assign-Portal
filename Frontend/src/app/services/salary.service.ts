import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from './api.config';
import { SalaryHistory } from '../core/models/salary-history.model';

@Injectable({
  providedIn: 'root'
})
export class SalaryService {
  private readonly apiUrl = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.salary}`;

  constructor(private http: HttpClient) {}

  updateSalary(employeeId: number, newSalary: number, changedBy: number, reason?: string): Observable<any> {
    let params = new HttpParams()
      .set('newSalary', newSalary.toString())
      .set('changedBy', changedBy.toString());

    if (reason) {
      params = params.set('reason', reason);
    }

    return this.http.put<any>(`${this.apiUrl}/${employeeId}`, null, { params });
  }

  getSalaryHistory(employeeId: number): Observable<SalaryHistory[]> {
    return this.http.get<SalaryHistory[]>(`${this.apiUrl}/history/${employeeId}`);
  }
}
