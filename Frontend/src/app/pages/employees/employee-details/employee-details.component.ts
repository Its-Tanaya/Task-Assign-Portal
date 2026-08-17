import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { MockDataService } from '../../../core/services/mock-data.service';
import { EmployeeService } from '../../../services/employee.service';
import { Employee } from '../../../core/models/employee.model';

const DEPARTMENT_ID_TO_NAME: { [key: number]: string } = {
  1: 'IT',
  2: 'Human Resources',
  3: 'Management',
  4: 'Engineering',
  5: 'Finance',
  6: 'Sales'
};

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './employee-details.component.html',
  styleUrl: './employee-details.component.scss'
})
export class EmployeeDetailsComponent implements OnInit {
  employee: Employee | null = null;
  employeeId!: number;
  loading = false;

  showDeleteModal = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService,
    public mockData: MockDataService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.employeeId = idParam ? Number(idParam) : 0;

    if (this.employeeId) {
      this.loadEmployee(this.employeeId);
    }
  }

  loadEmployee(id: number): void {
    this.loading = true;
    this.employeeService.getEmployeeById(id).subscribe({
      next: (emp) => {
        this.employee = emp ? this.normalizeEmployee(emp) : null;
        this.loading = false;
      },
      error: () => {
        this.employee = null;
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
      phone: emp.phone || 'N/A',
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

  get currentRole(): string {
    return this.authService.getRole() || 'Employee';
  }

  get canEdit(): boolean {
    return this.currentRole === 'HR' || this.currentRole === 'Manager';
  }

  get canDelete(): boolean {
    return this.currentRole === 'HR';
  }

  confirmDelete(): void {
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
  }

  executeDelete(): void {
    if (this.employee) {
      this.employeeService.deleteEmployee(this.employee.employeeId).subscribe({
        next: () => {
          this.showDeleteModal = false;
          this.router.navigate(['/employees']);
        },
        error: () => {
          this.showDeleteModal = false;
        }
      });
    }
  }
}
