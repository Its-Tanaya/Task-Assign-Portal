import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MockDataService } from '../../../core/services/mock-data.service';
import { EmployeeService } from '../../../services/employee.service';
import { AuthService } from '../../../core/services/auth.service';

const DEPARTMENT_MAP: { [key: string]: number } = {
  'IT': 1,
  'Human Resources': 2,
  'Management': 3,
  'Engineering': 4,
  'Finance': 5,
  'Sales': 6
};

const MANAGER_MAP: { [key: string]: number | null } = {
  'Sarah Jenkins': 1,
  'Michael Scott': 2,
  'Corporate Board': null
};

const LEAD_MAP: { [key: string]: number | null } = {
  'Dwight Schrute': 3,
  'Jim Halpert': 4,
  'N/A': null
};

@Component({
  selector: 'app-employee-add',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './employee-add.component.html',
  styleUrl: './employee-add.component.scss'
})
export class EmployeeAddComponent {
  employeeCode = '';
  name = '';
  email = '';
  phone = '';
  department = 'IT';
  role = 'Software Engineer';
  salary: number | null = null;
  joiningDate = new Date().toISOString().split('T')[0];
  manager = 'Michael Scott';
  projectLead = 'Dwight Schrute';
  status: 'Active' | 'Inactive' = 'Active';

  departments = ['IT', 'Human Resources', 'Management', 'Engineering', 'Finance', 'Sales'];
  roles = ['HR', 'Manager', 'Project Lead', 'Backend Developer', 'Frontend Developer', 'HR Specialist', 'QA Engineer', 'Software Engineer'];
  managers = ['Michael Scott', 'Sarah Jenkins', 'Corporate Board'];
  leads = ['Dwight Schrute', 'Jim Halpert', 'N/A'];

  submitted = false;
  saving = false;

  constructor(
    public mockData: MockDataService,
    private employeeService: EmployeeService,
    private authService: AuthService,
    private router: Router
  ) {}

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
      !this.isEmailValid ||
      !this.isPhoneValid ||
      !this.isSalaryValid
    ) {
      return;
    }

    this.saving = true;

    // Safely parse joining date to prevent runtime date formatting errors
    let formattedJoiningDate = new Date().toISOString();
    if (this.joiningDate) {
      const parsedDate = new Date(this.joiningDate);
      if (!isNaN(parsedDate.getTime())) {
        formattedJoiningDate = parsedDate.toISOString();
      }
    }

    // Get current logged-in user ID, fallback to 1 if not available
    const currentUserId = this.authService.getUserId() || 1;

    // Exact matching DTO structure expected by POST /api/Employee (tested in Swagger)
    const payload = {
      employeeId: 0,
      employeeCode: this.employeeCode.trim(),
      name: this.name.trim(),
      email: this.email.trim(),
      phone: this.phone ? this.phone.trim() : '',
      departmentId: DEPARTMENT_MAP[this.department] || 1,
      role: this.role || 'Software Engineer',
      salary: Number(this.salary),
      joiningDate: formattedJoiningDate,
      managerId: this.manager ? (MANAGER_MAP[this.manager] ?? null) : null,
      projectLeadId: this.projectLead ? (LEAD_MAP[this.projectLead] ?? null) : null,
      userId: currentUserId,
      isActive: this.status === 'Active'
    };

    console.log('[EmployeeAdd] Submitting payload:', payload);

    this.employeeService.addEmployee(payload).subscribe({
      next: (response) => {
        console.log('[EmployeeAdd] POST successful. Response:', response);
        this.saving = false;
        this.router.navigate(['/employees']);
      },
      error: (err) => {
        this.saving = false;
        console.error('[EmployeeAdd] POST failed with error:', err);
        console.error('[EmployeeAdd] Error status:', err.status);
        console.error('[EmployeeAdd] Error message:', err.message);
        console.error('[EmployeeAdd] Full error:', err);
      }
    });
  }
}
