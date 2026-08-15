using System.ComponentModel.DataAnnotations;

namespace TaskAssignAPI.Models
{
    public class Tasks
    {
        [Key]
        public int TaskId { get; set; }

        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        public int CreatedBy { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime Deadline { get; set; }

        public string Priority { get; set; } = string.Empty;

        public DateTime CreatedDate { get; set; }

        public bool IsActive { get; set; }
    }
}