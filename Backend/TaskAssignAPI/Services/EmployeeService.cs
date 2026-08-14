using TaskAssignAPI.Interfaces;
using TaskAssignAPI.Models;

namespace TaskAssignAPI.Services
{
    public class EmployeeService : IEmployeeService
    {
        private readonly IGenericRepository<Employees> _repository;

        public EmployeeService(IGenericRepository<Employees> repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<Employees>> GetAllEmployeesAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<Employees?> GetEmployeeByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task AddEmployeeAsync(Employees employee)
        {
            await _repository.AddAsync(employee);
            await _repository.SaveAsync();
        }

        public async Task UpdateEmployeeAsync(Employees employee)
        {
            _repository.Update(employee);
            await _repository.SaveAsync();
        }

        public async Task DeleteEmployeeAsync(int id)
        {
            var employee = await _repository.GetByIdAsync(id);

            if (employee != null)
            {
                _repository.Delete(employee);
                await _repository.SaveAsync();
            }
        }
    }
}