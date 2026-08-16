import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HrDashboardComponent } from './pages/dashboard/hr-dashboard/hr-dashboard.component';
import { ManagerDashboardComponent } from './pages/dashboard/manager-dashboard/manager-dashboard.component';
import { ProjectLeadDashboardComponent } from './pages/dashboard/lead-dashboard/lead-dashboard.component';
import { EmployeeDashboardComponent } from './pages/dashboard/employee-dashboard/employee-dashboard.component';
import { EmployeesComponent } from './pages/employees/employees.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { SalaryComponent } from './pages/salary/salary.component';
import { MessagesComponent } from './pages/messages/messages.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { ProfileComponent } from './pages/profile/profile.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'hr/dashboard', component: HrDashboardComponent },
  { path: 'manager/dashboard', component: ManagerDashboardComponent },
  { path: 'lead/dashboard', component: ProjectLeadDashboardComponent },
  { path: 'employee/dashboard', component: EmployeeDashboardComponent },
  { path: 'dashboard', redirectTo: 'hr/dashboard', pathMatch: 'full' },
  { path: 'employees', component: EmployeesComponent },
  { path: 'tasks', component: TasksComponent },
  { path: 'salary', component: SalaryComponent },
  { path: 'messages', component: MessagesComponent },
  { path: 'reports', component: ReportsComponent },
  { path: 'profile', component: ProfileComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
