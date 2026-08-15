using TaskAssignAPI.DTOs;

namespace TaskAssignAPI.Services
{
    public interface ITaskAssignmentService
    {
        Task<IEnumerable<TaskAssignmentDto>> GetAllAssignmentsAsync();

        Task<IEnumerable<TaskAssignmentDto>> GetAssignmentsByTaskAsync(int taskId);

        Task<IEnumerable<TaskAssignmentDto>> GetAssignmentsByEmployeeAsync(int employeeId);

        Task AssignTaskAsync(TaskAssignmentDto assignmentDto);

        Task UpdateStatusAsync(int taskAssignmentId, string status);

        Task RemoveAssignmentAsync(int id);
    }
}