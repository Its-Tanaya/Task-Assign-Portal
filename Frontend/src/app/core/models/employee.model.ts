export interface Employee {
  employeeId: number;
  employeeCode: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  departmentId?: number;
  role: string;
  salary: number;
  joiningDate: string;
  manager: string;
  projectLead: string;
  managerId?: number | null;
  projectLeadId?: number | null;
  status: 'Active' | 'Inactive';
  userId: number;
  isActive?: boolean;
}


