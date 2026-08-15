using AutoMapper;
using TaskAssignAPI.DTOs;
using TaskAssignAPI.Interfaces;
using TaskAssignAPI.Models;

namespace TaskAssignAPI.Services
{
    public class TaskService : ITaskService
    {
        private readonly IGenericRepository<Tasks> _repository;
        private readonly IMapper _mapper;

        public TaskService(
            IGenericRepository<Tasks> repository,
            IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<TaskDto>> GetAllTasksAsync()
        {
            var tasks = await _repository.GetAllAsync();

            return _mapper.Map<IEnumerable<TaskDto>>(tasks);
        }

        public async Task<TaskDto?> GetTaskByIdAsync(int id)
        {
            var task = await _repository.GetByIdAsync(id);

            if (task == null)
                return null;

            return _mapper.Map<TaskDto>(task);
        }

        public async Task AddTaskAsync(TaskDto taskDto)
        {
            var task = _mapper.Map<Tasks>(taskDto);

            await _repository.AddAsync(task);
            await _repository.SaveAsync();
        }

        public async Task UpdateTaskAsync(TaskDto taskDto)
        {
            var task = await _repository.GetByIdAsync(taskDto.TaskId);

            if (task == null)
                return;

            task.Title = taskDto.Title;
            task.Description = taskDto.Description;
            task.CreatedBy = taskDto.CreatedBy;
            task.StartDate = taskDto.StartDate;
            task.Deadline = taskDto.Deadline;
            task.Priority = taskDto.Priority;
            task.CreatedDate = taskDto.CreatedDate;
            task.IsActive = taskDto.IsActive;

            await _repository.SaveAsync();
        }

        public async Task DeleteTaskAsync(int id)
        {
            var task = await _repository.GetByIdAsync(id);

            if (task != null)
            {
                _repository.Delete(task);
                await _repository.SaveAsync();
            }
        }
    }
}