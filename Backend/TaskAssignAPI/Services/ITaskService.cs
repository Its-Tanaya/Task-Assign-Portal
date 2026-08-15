using TaskAssignAPI.DTOs;

namespace TaskAssignAPI.Services
{
    public interface ITaskService
    {
        Task<IEnumerable<TaskDto>> GetAllTasksAsync();

        Task<TaskDto?> GetTaskByIdAsync(int id);

        Task AddTaskAsync(TaskDto taskDto);

        Task UpdateTaskAsync(TaskDto taskDto);

        Task DeleteTaskAsync(int id);
    }
}