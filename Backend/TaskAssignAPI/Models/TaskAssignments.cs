namespace TaskAssignAPI.Models
{
    public class TaskAssignments
    {
        public int TaskAssignmentId { get; set; }

        public int TaskId { get; set; }

        public int EmployeeId { get; set; }

        public string Status { get; set; } = string.Empty;

        public DateTime AssignedDate { get; set; }

        public DateTime? CompletedOn { get; set; }
    }
}