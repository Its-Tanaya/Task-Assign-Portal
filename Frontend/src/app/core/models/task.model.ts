export interface TaskItem {
  taskId: number;
  title: string;
  description?: string;
  createdBy: number;
  startDate: string;
  deadline: string;
  priority: string;
  createdDate?: string;
  isActive?: boolean;
}
