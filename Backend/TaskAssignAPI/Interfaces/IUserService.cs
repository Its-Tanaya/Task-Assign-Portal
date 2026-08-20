using TaskAssignAPI.DTOs;

namespace TaskAssignAPI.Interfaces
{
    public interface IUserService
    {
        Task<IEnumerable<UserDto>> GetAllUsersAsync();
    }
}