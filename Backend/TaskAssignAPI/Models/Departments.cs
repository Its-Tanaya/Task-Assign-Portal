using System.ComponentModel.DataAnnotations;

namespace TaskAssignAPI.Models
{
    public class Departments
    {
        [Key]
        public int DepartmentId { get; set; }

        public string DepartmentName { get; set; } = string.Empty;
    }
}