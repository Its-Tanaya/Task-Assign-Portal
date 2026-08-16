export interface Employee {
  employeeId: number;
  employeeCode: string;
  name: string;
  email: string;
  phone?: string;
  departmentId: number;
  role: string;
  salary: number;
  joiningDate: string;
  managerId?: number;
  projectLeadId?: number;
  userId: number;
  isActive: boolean;
}
