using AutoMapper;
using TaskAssignAPI.DTOs;
using TaskAssignAPI.Interfaces;
using TaskAssignAPI.Models;

namespace TaskAssignAPI.Services
{
    public class TaskAssignmentService : ITaskAssignmentService
    {
        private readonly IGenericRepository<TaskAssignments> _repository;
        private readonly IMapper _mapper;

        public TaskAssignmentService(
            IGenericRepository<TaskAssignments> repository,
            IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<TaskAssignmentDto>> GetAllAssignmentsAsync()
        {
            var assignments = await _repository.GetAllAsync();

            return _mapper.Map<IEnumerable<TaskAssignmentDto>>(assignments);
        }

        public async Task<IEnumerable<TaskAssignmentDto>> GetAssignmentsByTaskAsync(int taskId)
        {
            var assignments = await _repository.GetAllAsync();

            var taskAssignments = assignments
                .Where(a => a.TaskId == taskId);

            return _mapper.Map<IEnumerable<TaskAssignmentDto>>(taskAssignments);
        }

        public async Task<IEnumerable<TaskAssignmentDto>> GetAssignmentsByEmployeeAsync(int employeeId)
        {
            var assignments = await _repository.GetAllAsync();

            var employeeAssignments = assignments
                .Where(a => a.EmployeeId == employeeId);

            return _mapper.Map<IEnumerable<TaskAssignmentDto>>(employeeAssignments);
        }

        public async Task AssignTaskAsync(TaskAssignmentDto assignmentDto)
        {
            var assignment = _mapper.Map<TaskAssignments>(assignmentDto);

            assignment.AssignedDate = DateTime.Now;

            await _repository.AddAsync(assignment);
            await _repository.SaveAsync();
        }

        public async Task UpdateStatusAsync(int taskAssignmentId, string status)
        {
            var assignment =
                await _repository.GetByIdAsync(taskAssignmentId);

            if (assignment == null)
                return;

            assignment.Status = status;

            if (status == "Completed")
            {
                assignment.CompletedOn = DateTime.Now;
            }

            _repository.Update(assignment);
            await _repository.SaveAsync();
        }

        public async Task RemoveAssignmentAsync(int id)
        {
            var assignment =
                await _repository.GetByIdAsync(id);

            if (assignment != null)
            {
                _repository.Delete(assignment);
                await _repository.SaveAsync();
            }
        }
    }
}