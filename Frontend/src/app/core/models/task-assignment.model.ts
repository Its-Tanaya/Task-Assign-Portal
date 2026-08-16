export interface TaskAssignment {
  taskAssignmentId: number;
  taskId: number;
  employeeId: number;
  status: string;
  assignedDate: string;
  completedOn?: string;
}
