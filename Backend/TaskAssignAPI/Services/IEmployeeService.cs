using TaskAssignAPI.Models;

namespace TaskAssignAPI.Services
{
    public interface IEmployeeService
    {
        Task<IEnumerable<Employees>> GetAllEmployeesAsync();
        Task<Employees?> GetEmployeeByIdAsync(int id);
        Task AddEmployeeAsync(Employees employee);
        Task UpdateEmployeeAsync(Employees employee);
        Task DeleteEmployeeAsync(int id);
    }
}