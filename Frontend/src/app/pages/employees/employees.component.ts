import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MockDataService } from '../../core/services/mock-data.service';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../core/models/employee.model';

const DEPARTMENT_MAP: { [key: number]: string } = {
  1: 'IT',
  2: 'Human Resources',
  3: 'Management',
  4: 'Engineering',
  5: 'Finance',
  6: 'Sales'
};

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.scss'
})
export class EmployeesComponent implements OnInit {
  searchTerm = '';
  selectedDepartment = '';
  selectedRole = '';
  selectedStatus = '';

  employees: Employee[] = [];
  loading = false;

  // Delete modal state
  showDeleteModal = false;
  employeeToDelete: Employee | null = null;
  deleteErrorMessage = '';

  departments = ['IT', 'Human Resources', 'Management', 'Engineering', 'Finance', 'Sales'];
  roles = ['HR', 'Manager', 'Project Lead', 'Backend Developer', 'Frontend Developer', 'HR Specialist', 'QA Engineer', 'Software Engineer'];
  statuses = ['Active', 'Inactive'];

  constructor(
    public authService: AuthService,
    public mockData: MockDataService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.loading = true;
    this.employeeService.getEmployees().subscribe({
      next: (data) => {
        this.employees = (data || []).map((emp) => this.normalizeEmployee(emp));
        this.loading = false;
      },
      error: () => {
        this.employees = [];
        this.loading = false;
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
      department: emp.department || DEPARTMENT_MAP[emp.departmentId] || 'IT',
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
    return this.employees.filter((emp) => {
      const term = this.searchTerm.toLowerCase().trim();
      const matchSearch = !term ||
        emp.name.toLowerCase().includes(term) ||
        emp.employeeCode.toLowerCase().includes(term);

      const matchDept = !this.selectedDepartment || emp.department === this.selectedDepartment;
      const matchRole = !this.selectedRole || emp.role === this.selectedRole;
      const matchStatus = !this.selectedStatus || emp.status === this.selectedStatus;

      return matchSearch && matchDept && matchRole && matchStatus;
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedDepartment = '';
    this.selectedRole = '';
    this.selectedStatus = '';
  }

  confirmDelete(emp: Employee): void {
    this.employeeToDelete = emp;
    this.deleteErrorMessage = '';
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.employeeToDelete = null;
  }

  executeDelete(): void {
    if (this.employeeToDelete) {
      this.employeeService.deleteEmployee(this.employeeToDelete.employeeId).subscribe({
        next: () => {
          this.deleteErrorMessage = '';
          this.loadEmployees();
          this.showDeleteModal = false;
          this.employeeToDelete = null;
        },
        error: (err: HttpErrorResponse) => {
          this.showDeleteModal = false;
          this.employeeToDelete = null;
          console.error('[Employees] DELETE failed with complete HttpErrorResponse:', err);
          this.deleteErrorMessage = this.formatHttpError(err);
        }
      });
    }
  }

  private formatHttpError(error: HttpErrorResponse): string {
    const backendError = error.error;
    const backendMessage = typeof backendError === 'string'
      ? backendError
      : backendError?.message || backendError?.title || (backendError ? JSON.stringify(backendError) : '');
    const message = backendMessage || error.message || 'Unknown error';
    const status = error.status ? `${error.status} ${error.statusText || ''}`.trim() : 'Network error';

    return `Unable to delete employee (${status}): ${message}`;
  }
}
