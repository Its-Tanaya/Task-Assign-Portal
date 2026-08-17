import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { MockDataService } from '../../core/services/mock-data.service';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../core/models/employee.model';

const DEPARTMENT_ID_TO_NAME: { [key: number]: string } = {
  1: 'IT',
  2: 'Human Resources',
  3: 'Management',
  4: 'Engineering',
  5: 'Finance',
  6: 'Sales'
};

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  currentEmployee: Employee | null = null;
  loading = false;

  constructor(
    public authService: AuthService,
    public mockData: MockDataService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;
    const currentUserId = this.authService.getUserId() || 1;
    const currentUser = this.authService.getUser();

    this.employeeService.getEmployees().subscribe({
      next: (emps) => {
        const normalized = (emps || []).map((e) => this.normalizeEmployee(e));
        // Match by userId or employeeId or username
        const matched =
          normalized.find((e) => e.userId === currentUserId) ||
          normalized.find((e) => e.employeeId === currentUserId) ||
          (currentUser ? normalized.find((e) => e.name.toLowerCase() === currentUser.username.toLowerCase()) : null) ||
          normalized[0];

        if (matched) {
          this.currentEmployee = matched;
        } else if (currentUser) {
          this.currentEmployee = {
            employeeId: currentUser.userId,
            employeeCode: `EMP00${currentUser.userId}`,
            name: currentUser.username,
            email: `${currentUser.username.toLowerCase().replace(/\s+/g, '.')}@portal.com`,
            phone: 'N/A',
            department: currentUser.role === 'HR' ? 'Human Resources' : 'Engineering',
            role: currentUser.role,
            salary: 50000,
            joiningDate: new Date().toISOString().split('T')[0],
            manager: 'Corporate Board',
            projectLead: 'N/A',
            status: 'Active',
            userId: currentUser.userId
          };
        }
        this.loading = false;
      },
      error: () => {
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
      userId: emp.userId || emp.employeeId,
      isActive: emp.isActive
    };
  }
}
