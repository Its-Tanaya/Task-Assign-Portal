import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MockDataService } from '../../../core/services/mock-data.service';
import { Employee } from '../../../core/models/employee.model';

@Component({
  selector: 'app-employee-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './employee-edit.component.html',
  styleUrl: './employee-edit.component.scss'
})
export class EmployeeEditComponent implements OnInit {
  employeeId!: number;
  userId: number = 0;
  employeeCode = '';
  name = '';
  email = '';
  phone = '';
  department = '';
  role = '';
  salary: number | null = null;
  joiningDate = '';
  manager = '';
  projectLead = '';
  status: 'Active' | 'Inactive' = 'Active';

  departments = ['IT', 'Human Resources', 'Management', 'Engineering', 'Finance', 'Sales'];
  roles = ['HR', 'Manager', 'Project Lead', 'Backend Developer', 'Frontend Developer', 'HR Specialist', 'QA Engineer', 'Software Engineer'];
  managers = ['Michael Scott', 'Sarah Jenkins', 'Corporate Board'];
  leads = ['Dwight Schrute', 'Jim Halpert', 'N/A'];

  submitted = false;
  notFound = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mockData: MockDataService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.employeeId = idParam ? Number(idParam) : 0;
    this.userId = 0;
    this.employeeCode = '';
    this.name = '';
    this.email = '';
    this.phone = '';
    this.department = '';
    this.role = '';
    this.salary = null;
    this.joiningDate = '';
    this.manager = '';
    this.projectLead = '';
    this.status = 'Active';
    this.notFound = true;
  }

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

    const updatedEmp: Employee = {
      employeeId: this.employeeId,
      userId: this.userId,
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
    };

    this.mockData.updateEmployee(updatedEmp);
    this.router.navigate(['/employees']);
  }
}
