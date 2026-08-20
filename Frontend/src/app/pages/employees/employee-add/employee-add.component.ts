import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MockDataService } from '../../../core/services/mock-data.service';
import { EmployeeService } from '../../../services/employee.service';
import { CreateEmployee, Employee } from '../../../core/models/employee.model';

const DEPARTMENT_MAP: { [key: string]: number } = {
  'IT': 1,
  'Human Resources': 2,
  'Management': 3,
  'Engineering': 4,
  'Finance': 5,
  'Sales': 6
};

@Component({
  selector: 'app-employee-add',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './employee-add.component.html',
  styleUrl: './employee-add.component.scss'
})
export class EmployeeAddComponent implements OnInit {
  employeeCode = '';
  name = '';
  email = '';
  phone = '';
  password = '';
  department = 'IT';
  role = 'Software Engineer';
  salary: number | null = null;
  joiningDate = new Date().toISOString().split('T')[0];
  manager = 'Corporate Board';
  projectLead = 'N/A';
  status: 'Active' | 'Inactive' = 'Active';

  departments = ['IT', 'Human Resources', 'Management', 'Engineering', 'Finance', 'Sales'];
  roles = ['HR', 'Manager', 'Project Lead', 'Backend Developer', 'Frontend Developer', 'HR Specialist', 'QA Engineer', 'Software Engineer'];
  managers = ['Corporate Board'];
  leads = ['N/A'];
  private employees: Employee[] = [];

  submitted = false;
  saving = false;
  submitErrorMessage = '';

  constructor(
    public mockData: MockDataService,
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.employeeService.getEmployees().subscribe({
      next: (employees) => {
        this.employees = employees || [];
        const employeeNames = this.employees.map((employee) => employee.name).filter(Boolean);
        this.managers = ['Corporate Board', ...employeeNames];
        this.leads = ['N/A', ...employeeNames];
      },
      error: (err) => {
        console.error('[EmployeeAdd] Failed to load employee relationships:', err);
      }
    });
  }

  // Validations
  get isEmailValid(): boolean {
    if (!this.email) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email.trim());
  }

  get isPhoneValid(): boolean {
    if (!this.phone) return false;
    const trimmed = this.phone.trim();
    return /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/.test(trimmed) && trimmed.length >= 7;
  }

  get isSalaryValid(): boolean {
    return this.salary !== null && Number(this.salary) > 0;
  }

  onSubmit(): void {
    this.submitted = true;

    if (
      !this.name ||
      !this.employeeCode ||
      !this.password.trim() ||
      !this.isEmailValid ||
      !this.isPhoneValid ||
      !this.isSalaryValid
    ) {
      return;
    }

    this.saving = true;
    this.submitErrorMessage = '';

    // Safely parse joining date to prevent runtime date formatting errors
    let formattedJoiningDate = new Date().toISOString();
    if (this.joiningDate) {
      const parsedDate = new Date(this.joiningDate);
      if (!isNaN(parsedDate.getTime())) {
        formattedJoiningDate = parsedDate.toISOString();
      }
    }

    const payload: CreateEmployee = {
      employeeCode: this.employeeCode.trim(),
      name: this.name.trim(),
      email: this.email.trim(),
      phone: this.phone ? this.phone.trim() : '',
      departmentId: DEPARTMENT_MAP[this.department] || 1,
      role: this.role || 'Software Engineer',
      salary: Number(this.salary),
      joiningDate: formattedJoiningDate,
      managerId: this.getEmployeeId(this.manager),
      projectLeadId: this.getEmployeeId(this.projectLead),
      password: this.password,
      isActive: this.status === 'Active'
    };

    console.log('[EmployeeAdd] Submitting payload:', payload);

    this.employeeService.addEmployee(payload).subscribe({
      next: (response) => {
        console.log('[EmployeeAdd] POST successful. Response:', response);
        this.saving = false;
        this.router.navigate(['/employees']);
      },
      error: (err: HttpErrorResponse) => {
        this.saving = false;
        console.error('[EmployeeAdd] POST failed with complete HttpErrorResponse:', err);
        this.submitErrorMessage = this.formatHttpError(err);
      }
    });
  }

  private formatHttpError(error: HttpErrorResponse): string {
    const backendError = error.error;
    const backendMessage = typeof backendError === 'string'
      ? backendError
      : backendError?.message || backendError?.title || (backendError ? JSON.stringify(backendError) : '');
    const message = backendMessage || error.message || 'Unknown error';
    const status = error.status ? `${error.status} ${error.statusText || ''}`.trim() : 'Network error';

    return `Unable to save employee (${status}): ${message}`;
  }

  private getEmployeeId(name: string): number | null {
    if (!name || name === 'Corporate Board' || name === 'N/A') {
      return null;
    }

    return this.employees.find((employee) => employee.name === name)?.employeeId ?? null;
  }
}
