using TaskAssignAPI.DTOs;

namespace TaskAssignAPI.Services
{
    public interface ISalaryService
    {
        Task UpdateSalaryAsync(
            int employeeId,
            decimal newSalary,
            int changedBy,
            string? reason);

        Task<IEnumerable<SalaryHistoryDto>> GetSalaryHistoryAsync(
            int employeeId);
    }
}