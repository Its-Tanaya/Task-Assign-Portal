import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { MockDataService } from '../../../core/services/mock-data.service';
import { Employee } from '../../../core/models/employee.model';

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

  showDeleteModal = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService,
    public mockData: MockDataService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.employeeId = idParam ? Number(idParam) : 0;
    this.employee = null;
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
      this.mockData.deleteEmployee(this.employee.employeeId);
      this.router.navigate(['/employees']);
    }
  }
}
