using AutoMapper;
using TaskAssignAPI.DTOs;
using TaskAssignAPI.Interfaces;
using TaskAssignAPI.Models;

namespace TaskAssignAPI.Services
{
    public class SalaryService : ISalaryService
    {
        private readonly IGenericRepository<Employees> _employeeRepository;
        private readonly IGenericRepository<SalaryHistory> _salaryRepository;
        private readonly IMapper _mapper;

        public SalaryService(
            IGenericRepository<Employees> employeeRepository,
            IGenericRepository<SalaryHistory> salaryRepository,
            IMapper mapper)
        {
            _employeeRepository = employeeRepository;
            _salaryRepository = salaryRepository;
            _mapper = mapper;
        }

        public async Task UpdateSalaryAsync(
            int employeeId,
            decimal newSalary,
            int changedBy,
            string? reason)
        {
            var employee = await _employeeRepository.GetByIdAsync(employeeId);

            if (employee == null)
                return;

            var oldSalary = employee.Salary;

            employee.Salary = newSalary;

            var history = new SalaryHistory
            {
                EmployeeId = employeeId,
                OldSalary = oldSalary,
                NewSalary = newSalary,
                ChangeAmount = newSalary - oldSalary,
                ChangedBy = changedBy,
                ChangedAt = DateTime.Now,
                Reason = reason
            };

            _employeeRepository.Update(employee);
            await _salaryRepository.AddAsync(history);

            await _employeeRepository.SaveAsync();
            await _salaryRepository.SaveAsync();
        }

        public async Task<IEnumerable<SalaryHistoryDto>> GetSalaryHistoryAsync(
            int employeeId)
        {
            var history = await _salaryRepository.GetAllAsync();

            var employeeHistory = history
                .Where(x => x.EmployeeId == employeeId);

            return _mapper.Map<IEnumerable<SalaryHistoryDto>>(employeeHistory);
        }
    }
}