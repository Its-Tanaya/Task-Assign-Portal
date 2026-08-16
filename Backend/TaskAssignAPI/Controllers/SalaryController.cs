using Microsoft.AspNetCore.Mvc;
using TaskAssignAPI.Services;

namespace TaskAssignAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SalaryController : ControllerBase
    {
        private readonly ISalaryService _service;

        public SalaryController(ISalaryService service)
        {
            _service = service;
        }

        [HttpPut("{employeeId}")]
        public async Task<IActionResult> UpdateSalary(
            int employeeId,
            decimal newSalary,
            int changedBy,
            string? reason)
        {
            await _service.UpdateSalaryAsync(
                employeeId,
                newSalary,
                changedBy,
                reason);

            return Ok(new { message = "Salary updated successfully" });
        }

        [HttpGet("history/{employeeId}")]
        public async Task<IActionResult> GetSalaryHistory(int employeeId)
        {
            var history =
                await _service.GetSalaryHistoryAsync(employeeId);

            return Ok(history);
        }
    }
}