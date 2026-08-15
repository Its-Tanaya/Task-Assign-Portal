using Microsoft.AspNetCore.Mvc;
using TaskAssignAPI.DTOs;
using TaskAssignAPI.Services;

namespace TaskAssignAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TaskController : ControllerBase
    {
        private readonly ITaskService _taskService;

        public TaskController(ITaskService taskService)
        {
            _taskService = taskService;
        }

        // GET: api/Task
        [HttpGet]
        public async Task<IActionResult> GetAllTasks()
        {
            var tasks = await _taskService.GetAllTasksAsync();

            return Ok(tasks);
        }

        // GET: api/Task/1
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTaskById(int id)
        {
            var task = await _taskService.GetTaskByIdAsync(id);

            if (task == null)
                return NotFound("Task not found.");

            return Ok(task);
        }

        // POST: api/Task
        [HttpPost]
        public async Task<IActionResult> AddTask(TaskDto task)
        {
            await _taskService.AddTaskAsync(task);

            return Ok("Task added successfully.");
        }

        // PUT: api/Task/1
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(
            int id,
            TaskDto task)
        {
            if (id != task.TaskId)
                return BadRequest("Task ID does not match.");

            var existingTask =
                await _taskService.GetTaskByIdAsync(id);

            if (existingTask == null)
                return NotFound("Task not found.");

            await _taskService.UpdateTaskAsync(task);

            return Ok("Task updated successfully.");
        }

        // DELETE: api/Task/1
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var task = await _taskService.GetTaskByIdAsync(id);

            if (task == null)
                return NotFound("Task not found.");

            await _taskService.DeleteTaskAsync(id);

            return Ok("Task deleted successfully.");
        }
    }
}