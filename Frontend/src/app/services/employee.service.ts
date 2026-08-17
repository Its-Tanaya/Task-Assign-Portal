import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class EmployeeService {

    private apiUrl = 'https://localhost:7046/api/Employee';

    constructor(private http: HttpClient) { }

    getEmployees(): Observable<any> {
        return this.http.get<any>(this.apiUrl);
    }

    getEmployeeById(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${id}`);
    }

    addEmployee(employee: any): Observable<any> {
        return this.http.post<any>(this.apiUrl, employee);
    }
}