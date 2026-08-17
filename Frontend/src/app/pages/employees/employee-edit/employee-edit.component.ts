import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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

const DEPARTMENT_ID_TO_NAME: { [key: number]: string } = {
  1: 'IT',
  2: 'Human Resources',
  3: 'Management',
  4: 'Engineering',
  5: 'Finance',
  6: 'Sales'
};

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
  department = 'IT';
  role = 'Software Engineer';
  salary: number | null = null;
  joiningDate = '';
  manager = 'Michael Scott';
  projectLead = 'Dwight Schrute';
  status: 'Active' | 'Inactive' = 'Active';

  departments = ['IT', 'Human Resources', 'Management', 'Engineering', 'Finance', 'Sales'];
  roles = ['HR', 'Manager', 'Project Lead', 'Backend Developer', 'Frontend Developer', 'HR Specialist', 'QA Engineer', 'Software Engineer'];
  managers = ['Michael Scott', 'Sarah Jenkins', 'Corporate Board'];
  leads = ['Dwight Schrute', 'Jim Halpert', 'N/A'];

  submitted = false;
  notFound = false;
  saving = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public mockData: MockDataService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.employeeId = idParam ? Number(idParam) : 0;

    if (this.employeeId) {
      this.loadEmployee(this.employeeId);
    } else {
      this.notFound = true;
    }
  }

  loadEmployee(id: number): void {
    this.employeeService.getEmployeeById(id).subscribe({
      next: (emp) => {
        if (!emp) {
          this.notFound = true;
          return;
        }

        this.employeeId = emp.employeeId;
        this.userId = emp.userId || 0;
        this.employeeCode = emp.employeeCode || `EMP${emp.employeeId}`;
        this.name = emp.name || '';
        this.email = emp.email || '';
        this.phone = emp.phone || '';
        this.department = emp.department || (emp.departmentId ? DEPARTMENT_ID_TO_NAME[emp.departmentId] : 'IT') || 'IT';
        this.role = emp.role || 'Software Engineer';
        this.salary = emp.salary || 0;
        this.joiningDate = emp.joiningDate ? emp.joiningDate.toString().split('T')[0] : '';
        this.manager = emp.manager || 'Michael Scott';
        this.projectLead = emp.projectLead || 'Dwight Schrute';
        this.status = (emp.status || (emp.isActive !== false ? 'Active' : 'Inactive')) as 'Active' | 'Inactive';
        this.notFound = false;
      },
      error: () => {
        this.notFound = true;
      }
    });
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

    this.saving = true;

    const updatedEmployee: any = {
      employeeId: this.employeeId,
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
      userId: this.userId,
      isActive: this.status === 'Active'
    };

    this.employeeService.updateEmployee(this.employeeId, updatedEmployee).subscribe({
      next: () => {
        this.saving = false;
        this.router.navigate(['/employees']);
      },
      error: (err) => {
        this.saving = false;
        console.error('Failed to update employee', err);
      }
    });
  }
}
