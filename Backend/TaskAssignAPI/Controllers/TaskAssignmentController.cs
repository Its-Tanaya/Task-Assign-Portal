using Microsoft.AspNetCore.Mvc;
using TaskAssignAPI.DTOs;
using TaskAssignAPI.Services;

namespace TaskAssignAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskAssignmentController : ControllerBase
    {
        private readonly ITaskAssignmentService _service;

        public TaskAssignmentController(ITaskAssignmentService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllAssignments()
        {
            var assignments = await _service.GetAllAssignmentsAsync();
            return Ok(assignments);
        }

        [HttpGet("task/{taskId}")]
        public async Task<IActionResult> GetAssignmentsByTask(int taskId)
        {
            var assignments = await _service.GetAssignmentsByTaskAsync(taskId);
            return Ok(assignments);
        }

        [HttpGet("employee/{employeeId}")]
        public async Task<IActionResult> GetAssignmentsByEmployee(int employeeId)
        {
            var assignments = await _service.GetAssignmentsByEmployeeAsync(employeeId);
            return Ok(assignments);
        }

        [HttpPost]
        public async Task<IActionResult> AssignTask(TaskAssignmentDto assignmentDto)
        {
            await _service.AssignTaskAsync(assignmentDto);
            return Ok(new { message = "Task assigned successfully" });
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, string status)
        {
            await _service.UpdateStatusAsync(id, status);
            return Ok(new { message = "Task status updated successfully" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveAssignment(int id)
        {
            await _service.RemoveAssignmentAsync(id);
            return Ok(new { message = "Assignment removed successfully" });
        }
    }
}