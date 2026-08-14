namespace TaskAssignAPI.Models
{
    public class SalaryHistory
    {
        public int SalaryHistoryId { get; set; }

        public int EmployeeId { get; set; }

        public decimal OldSalary { get; set; }

        public decimal NewSalary { get; set; }

        public decimal ChangeAmount { get; set; }

        public int ChangedBy { get; set; }

        public DateTime ChangedAt { get; set; }

        public string? Reason { get; set; }
    }
}