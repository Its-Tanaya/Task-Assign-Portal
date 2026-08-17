import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../core/services/mock-data.service';
import { AuthService } from '../../core/services/auth.service';
import { SalaryService } from '../../services/salary.service';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../core/models/employee.model';
import { SalaryHistory } from '../../core/models/salary-history.model';

const DEPARTMENT_ID_TO_NAME: { [key: number]: string } = {
  1: 'IT',
  2: 'Human Resources',
  3: 'Management',
  4: 'Engineering',
  5: 'Finance',
  6: 'Sales'
};

@Component({
  selector: 'app-salary',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './salary.component.html',
  styleUrl: './salary.component.scss'
})
export class SalaryComponent implements OnInit {
  showUpdateModal = false;
  showHistoryModal = false;

  selectedEmployee: Employee | null = null;
  newSalary = 0;
  reason = '';

  selectedHistory: SalaryHistory[] = [];

  constructor(
    public mockData: MockDataService,
    public authService: AuthService,
    private salaryService: SalaryService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: (emps) => {
        const normalized = (emps || []).map((e) => this.normalizeEmployee(e));
        this.mockData.employees.set(normalized);
      },
      error: (err) => {
        console.error('Failed to load employees for salary management', err);
      }
    });
  }

  private normalizeEmployee(emp: any): Employee {
    return {
      employeeId: emp.employeeId,
      employeeCode: emp.employeeCode || `EMP${emp.employeeId}`,
      name: emp.name || '',
      email: emp.email || '',
      phone: emp.phone || '',
      department: emp.department || (emp.departmentId ? DEPARTMENT_ID_TO_NAME[emp.departmentId] : 'IT') || 'IT',
      departmentId: emp.departmentId || 1,
      role: emp.role || 'Employee',
      salary: emp.salary || 0,
      joiningDate: emp.joiningDate ? emp.joiningDate.toString().split('T')[0] : '',
      manager: emp.manager || 'Michael Scott',
      projectLead: emp.projectLead || 'Dwight Schrute',
      status: (emp.status || (emp.isActive !== false ? 'Active' : 'Inactive')) as 'Active' | 'Inactive',
      userId: emp.userId || 0,
      isActive: emp.isActive
    };
  }

  private normalizeHistory(h: any): SalaryHistory {
    return {
      salaryHistoryId: h.salaryHistoryId,
      employeeId: h.employeeId,
      oldSalary: h.oldSalary || 0,
      newSalary: h.newSalary || 0,
      changeAmount: h.changeAmount || (h.newSalary - h.oldSalary),
      changedBy: h.changedBy || 1,
      changedAt: h.changedAt ? h.changedAt.toString().split('T')[0] : '',
      reason: h.reason || 'No reason specified'
    };
  }

  openUpdateModal(emp: Employee): void {
    this.selectedEmployee = emp;
    this.newSalary = emp.salary;
    this.reason = '';
    this.showUpdateModal = true;
  }

  closeUpdateModal(): void {
    this.showUpdateModal = false;
    this.selectedEmployee = null;
  }

  saveSalaryUpdate(): void {
    if (!this.selectedEmployee || !this.newSalary) return;

    const changedBy = this.authService.getUserId() || 1;
    this.salaryService.updateSalary(
      this.selectedEmployee.employeeId,
      this.newSalary,
      changedBy,
      this.reason
    ).subscribe({
      next: () => {
        this.loadEmployees();
        this.closeUpdateModal();
      },
      error: (err) => {
        console.error('Failed to update salary', err);
        this.closeUpdateModal();
      }
    });
  }

  openHistoryModal(emp: Employee): void {
    this.selectedEmployee = emp;
    this.salaryService.getSalaryHistory(emp.employeeId).subscribe({
      next: (history) => {
        this.selectedHistory = (history || []).map((h) => this.normalizeHistory(h));
        this.showHistoryModal = true;
      },
      error: (err) => {
        console.error('Failed to load salary history', err);
        this.selectedHistory = [];
        this.showHistoryModal = true;
      }
    });
  }

  closeHistoryModal(): void {
    this.showHistoryModal = false;
    this.selectedEmployee = null;
    this.selectedHistory = [];
  }
}
