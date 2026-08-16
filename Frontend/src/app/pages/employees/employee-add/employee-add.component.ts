import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MockDataService } from '../../../core/services/mock-data.service';

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
  role = 'Backend Developer';
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

  constructor(
    private mockData: MockDataService,
    private router: Router
  ) {
    // Generate default code
    const count = this.mockData.employees().length + 1;
    this.employeeCode = `EMP${String(count).padStart(3, '0')}`;
  }

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

    this.mockData.addEmployee({
      employeeCode: this.employeeCode,
      name: this.name,
      email: this.email,
      phone: this.phone,
      department: this.department,
      role: this.role,
      salary: Number(this.salary),
      joiningDate: this.joiningDate,
      manager: this.manager,
      projectLead: this.projectLead,
      status: this.status
    });

    this.router.navigate(['/employees']);
  }
}
