export interface SalaryHistory {
  salaryHistoryId: number;
  employeeId: number;
  oldSalary: number;
  newSalary: number;
  changeAmount: number;
  changedBy: number;
  changedAt: string;
  reason?: string;
}
