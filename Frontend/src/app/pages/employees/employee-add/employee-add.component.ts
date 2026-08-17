import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MockDataService } from '../../../core/services/mock-data.service';
import { EmployeeService } from '../../../services/employee.service';

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
    private router: Router
  ) {}

  // Validations
  get isEmailValid(): boolean {
    if (!this.email) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
  }

  get isPhoneValid(): boolean {
    if (!this.phone) return false;
    return /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/.test(this.phone) && this.phone.length >= 7;
  }

  get isSalaryValid(): boolean {
    return this.salary !== null && this.salary > 0;
  }

  onSubmit(): void {
    this.submitted = true;

    if (!this.name || !this.employeeCode || !this.isEmailValid || !this.isPhoneValid || !this.isSalaryValid) {
      return;
    }

    this.saving = true;

    const newEmployee: any = {
      employeeCode: this.employeeCode.trim(),
      name: this.name.trim(),
      email: this.email.trim(),
      phone: this.phone.trim(),
      departmentId: DEPARTMENT_MAP[this.department] || 1,
      role: this.role,
      salary: Number(this.salary),
      joiningDate: this.joiningDate ? new Date(this.joiningDate).toISOString() : new Date().toISOString(),
      managerId: 2,
      projectLeadId: 3,
      userId: 0,
      isActive: this.status === 'Active'
    };

    this.employeeService.addEmployee(newEmployee).subscribe({
      next: () => {
        this.saving = false;
        this.router.navigate(['/employees']);
      },
      error: (err) => {
        this.saving = false;
        console.error('Failed to add employee', err);
      }
    });
  }
}
