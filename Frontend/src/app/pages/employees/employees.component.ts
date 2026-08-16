import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../core/services/mock-data.service';
import { AuthService } from '../../core/services/auth.service';
import { Employee } from '../../core/models/employee.model';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.scss'
})
export class EmployeesComponent {
  searchTerm = '';
  roleFilter = 'ALL';

  // Modal controls
  showAddModal = false;
  showEditModal = false;
  showDetailModal = false;

  selectedEmployee: Employee | null = null;

  // Form model
  formEmployee: Partial<Employee> = {
    name: '',
    email: '',
    phone: '',
    role: 'Employee',
    departmentId: 1,
    salary: 55000,
    joiningDate: new Date().toISOString().split('T')[0]
  };

  roles = ['HR', 'Manager', 'Project Lead', 'Employee'];

  constructor(
    public mockData: MockDataService,
    public authService: AuthService
  ) {}

  get filteredEmployees(): Employee[] {
    return this.mockData.employees().filter((emp) => {
      const matchesSearch =
        emp.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        emp.employeeCode.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesRole = this.roleFilter === 'ALL' || emp.role === this.roleFilter;

      return matchesSearch && matchesRole;
    });
  }

  openAddModal(): void {
    this.formEmployee = {
      name: '',
      email: '',
      phone: '',
      role: 'Employee',
      departmentId: 1,
      salary: 55000,
      joiningDate: new Date().toISOString().split('T')[0]
    };
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
  }

  saveAddEmployee(): void {
    if (!this.formEmployee.name || !this.formEmployee.email) return;
    this.mockData.addEmployee(this.formEmployee);
    this.closeAddModal();
  }

  openEditModal(emp: Employee): void {
    this.selectedEmployee = { ...emp };
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedEmployee = null;
  }

  saveEditEmployee(): void {
    if (!this.selectedEmployee) return;
    this.mockData.updateEmployee(this.selectedEmployee);
    this.closeEditModal();
  }

  openDetailModal(emp: Employee): void {
    this.selectedEmployee = emp;
    this.showDetailModal = true;
  }

  closeDetailModal(): void {
    this.showDetailModal = false;
    this.selectedEmployee = null;
  }

  deleteEmployee(id: number): void {
    if (confirm('Are you sure you want to remove this employee record?')) {
      this.mockData.deleteEmployee(id);
    }
  }
}
