using TaskAssignAPI.DTOs;

namespace TaskAssignAPI.Services
{
    public interface ILoginService
    {
        Task<object?> LoginAsync(LoginDto loginDto);
    }
}