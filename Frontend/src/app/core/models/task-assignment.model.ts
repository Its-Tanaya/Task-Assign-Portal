export interface TaskAssignment {
  taskAssignmentId: number;
  taskId: number;
  employeeId: number;
  status: string; // 'Pending' | 'In Progress' | 'Completed' | 'Overdue'
  assignedDate: string;
  completedOn?: string;
}
