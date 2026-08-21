using AutoMapper;
using Microsoft.EntityFrameworkCore;
using TaskAssignAPI.Data;
using TaskAssignAPI.DTOs;
using TaskAssignAPI.Interfaces;
using TaskAssignAPI.Models;

namespace TaskAssignAPI.Services
{
    public class EmployeeService : IEmployeeService
    {
        private readonly IGenericRepository<Employees> _repository;
        private readonly IGenericRepository<Users> _userRepository;
        private readonly IMapper _mapper;
        private readonly AppDbContext _context;

        public EmployeeService(
            IGenericRepository<Employees> repository,
            IGenericRepository<Users> userRepository,
            IMapper mapper,
            AppDbContext context)
        {
            _repository = repository;
            _userRepository = userRepository;
            _mapper = mapper;
            _context = context;
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

        public async Task AddEmployeeAsync(CreateEmployeeDto employeeDto)
        {
            var user = new Users
            {
                Username = employeeDto.Email,
                PasswordHash = employeeDto.Password,
                Role = employeeDto.Role,
                IsActive = true
            };

            await _userRepository.AddAsync(user);
            await _userRepository.SaveAsync();

            var employee = new Employees
            {
                EmployeeCode = employeeDto.EmployeeCode,
                Name = employeeDto.Name,
                Email = employeeDto.Email,
                Phone = employeeDto.Phone,
                DepartmentId = employeeDto.DepartmentId,
                Role = employeeDto.Role,
                Salary = employeeDto.Salary,
                JoiningDate = employeeDto.JoiningDate,
                ManagerId = employeeDto.ManagerId,
                ProjectLeadId = employeeDto.ProjectLeadId,
                UserId = user.UserId,
                IsActive = employeeDto.IsActive
            };

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

            if (employee == null)
                return;

            // Store the UserId before deleting the employee
            var userId = employee.UserId;

            // Delete the employee
            _repository.Delete(employee);
            await _repository.SaveAsync();

            // Delete the related user account
            var user = await _userRepository.GetByIdAsync(userId);

            if (user != null)
            {
                _userRepository.Delete(user);
                await _userRepository.SaveAsync();
            }
        }
    }
    
}