namespace TaskAssignAPI.DTOs
{
    public class EmployeeDto
    {
        public int EmployeeId { get; set; }

        public string EmployeeCode { get; set; } = string.Empty;

        public string Name { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string? Phone { get; set; }

        public int DepartmentId { get; set; }

        public string Role { get; set; } = string.Empty;

        public decimal Salary { get; set; }

        public DateTime JoiningDate { get; set; }

        public int? ManagerId { get; set; }

        public int? ProjectLeadId { get; set; }

        public int UserId { get; set; }

        public bool IsActive { get; set; }
    }
}