using TaskAssignAPI.DTOs;

namespace TaskAssignAPI.Interfaces
{
    public interface IEmployeeService
    {
        Task<IEnumerable<EmployeeDto>> GetAllEmployeesAsync();

        Task<EmployeeDto?> GetEmployeeByIdAsync(int id);

        Task AddEmployeeAsync(CreateEmployeeDto employeeDto);

        Task UpdateEmployeeAsync(EmployeeDto employeeDto);

        Task DeleteEmployeeAsync(int id);
    }
}