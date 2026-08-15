using Microsoft.AspNetCore.Mvc;
using TaskAssignAPI.DTOs;
using TaskAssignAPI.Services;

namespace TaskAssignAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeeController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;

        public EmployeeController(IEmployeeService employeeService)
        {
            _employeeService = employeeService;
        }

        // GET: api/Employee
        [HttpGet]
        public async Task<IActionResult> GetAllEmployees()
        {
            var employees = await _employeeService.GetAllEmployeesAsync();

            return Ok(employees);
        }

        // GET: api/Employee/1
        [HttpGet("{id}")]
        public async Task<IActionResult> GetEmployeeById(int id)
        {
            var employee = await _employeeService.GetEmployeeByIdAsync(id);

            if (employee == null)
                return NotFound("Employee not found.");

            return Ok(employee);
        }

        // POST: api/Employee
        [HttpPost]
        public async Task<IActionResult> AddEmployee(EmployeeDto employee)
        {
            await _employeeService.AddEmployeeAsync(employee);

            return Ok("Employee added successfully.");
        }

        // PUT: api/Employee/1
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEmployee(
            int id,
            EmployeeDto employee)
        {
            if (id != employee.EmployeeId)
                return BadRequest("Employee ID does not match.");

            var existingEmployee =
                await _employeeService.GetEmployeeByIdAsync(id);

            if (existingEmployee == null)
                return NotFound("Employee not found.");

            await _employeeService.UpdateEmployeeAsync(employee);

            return Ok("Employee updated successfully.");
        }

        // DELETE: api/Employee/1
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            var employee = await _employeeService.GetEmployeeByIdAsync(id);

            if (employee == null)
                return NotFound("Employee not found.");

            await _employeeService.DeleteEmployeeAsync(id);

            return Ok("Employee deleted successfully.");
        }
    }
}