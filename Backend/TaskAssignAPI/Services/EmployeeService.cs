using AutoMapper;
using TaskAssignAPI.DTOs;
using TaskAssignAPI.Interfaces;
using TaskAssignAPI.Models;

namespace TaskAssignAPI.Services
{
    public class EmployeeService : IEmployeeService
    {
        private readonly IGenericRepository<Employees> _repository;
        private readonly IMapper _mapper;

        public EmployeeService(
            IGenericRepository<Employees> repository,
            IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<EmployeeDto>> GetAllEmployeesAsync()
        {
            var employees = await _repository.GetAllAsync();

            return _mapper.Map<IEnumerable<EmployeeDto>>(employees);
        }

        public async Task<EmployeeDto?> GetEmployeeByIdAsync(int id)
        {
            var employee = await _repository.GetByIdAsync(id);

            if (employee == null)
                return null;

            return _mapper.Map<EmployeeDto>(employee);
        }

        public async Task AddEmployeeAsync(EmployeeDto employeeDto)
        {
            var employee = _mapper.Map<Employees>(employeeDto);

            await _repository.AddAsync(employee);
            await _repository.SaveAsync();
        }

        public async Task UpdateEmployeeAsync(EmployeeDto employeeDto)
        {
            var employee = await _repository.GetByIdAsync(employeeDto.EmployeeId);

            if (employee == null)
                return;

            employee.EmployeeCode = employeeDto.EmployeeCode;
            employee.Name = employeeDto.Name;
            employee.Email = employeeDto.Email;
            employee.Phone = employeeDto.Phone;
            employee.DepartmentId = employeeDto.DepartmentId;
            employee.Role = employeeDto.Role;
            employee.Salary = employeeDto.Salary;
            employee.JoiningDate = employeeDto.JoiningDate;
            employee.ManagerId = employeeDto.ManagerId;
            employee.ProjectLeadId = employeeDto.ProjectLeadId;
            employee.UserId = employeeDto.UserId;
            employee.IsActive = employeeDto.IsActive;

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