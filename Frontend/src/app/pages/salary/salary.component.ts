import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../core/services/mock-data.service';
import { AuthService } from '../../core/services/auth.service';
import { Employee } from '../../core/models/employee.model';
import { SalaryHistory } from '../../core/models/salary-history.model';

@Component({
  selector: 'app-salary',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './salary.component.html',
  styleUrl: './salary.component.scss'
})
export class SalaryComponent {
  showUpdateModal = false;
  showHistoryModal = false;

  selectedEmployee: Employee | null = null;
  newSalary = 0;
  reason = '';

  selectedHistory: SalaryHistory[] = [];

  constructor(
    public mockData: MockDataService,
    public authService: AuthService
  ) {}

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
    this.mockData.updateSalary(
      this.selectedEmployee.employeeId,
      this.newSalary,
      this.authService.getUserId() || 1,
      this.reason
    );
    this.closeUpdateModal();
  }

  openHistoryModal(emp: Employee): void {
    this.selectedEmployee = emp;
    this.selectedHistory = this.mockData
      .salaryHistory()
      .filter((h) => h.employeeId === emp.employeeId);
    this.showHistoryModal = true;
  }

  closeHistoryModal(): void {
    this.showHistoryModal = false;
    this.selectedEmployee = null;
    this.selectedHistory = [];
  }
}
