import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MockDataService } from '../../core/services/mock-data.service';
import { Employee } from '../../core/models/employee.model';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.scss'
})
export class EmployeesComponent {
  searchTerm = '';
  selectedDepartment = '';
  selectedRole = '';
  selectedStatus = '';

  // Delete modal state
  showDeleteModal = false;
  employeeToDelete: Employee | null = null;

  departments = ['IT', 'Human Resources', 'Management', 'Engineering', 'Finance', 'Sales'];
  roles = ['HR', 'Manager', 'Project Lead', 'Backend Developer', 'Frontend Developer', 'HR Specialist', 'QA Engineer', 'Software Engineer'];
  statuses = ['Active', 'Inactive'];

  constructor(
    public authService: AuthService,
    public mockData: MockDataService
  ) {}

  get currentRole(): string {
    return this.authService.getRole() || 'Employee';
  }

  get isHr(): boolean {
    return this.currentRole === 'HR';
  }

  get isManager(): boolean {
    return this.currentRole === 'Manager';
  }

  get isLead(): boolean {
    return this.currentRole === 'Project Lead';
  }

  get canAdd(): boolean {
    return this.isHr || this.isManager;
  }

  get canEdit(): boolean {
    return this.isHr || this.isManager;
  }

  get canDelete(): boolean {
    return this.isHr;
  }

  get filteredEmployees(): Employee[] {
    return [];
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedDepartment = '';
    this.selectedRole = '';
    this.selectedStatus = '';
  }

  confirmDelete(emp: Employee): void {
    this.employeeToDelete = emp;
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.employeeToDelete = null;
  }

  executeDelete(): void {
    if (this.employeeToDelete) {
      this.mockData.deleteEmployee(this.employeeToDelete.employeeId);
      this.showDeleteModal = false;
      this.employeeToDelete = null;
    }
  }
}
