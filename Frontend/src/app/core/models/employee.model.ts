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
  status: 'Active' | 'Inactive';
  userId: number;
}
