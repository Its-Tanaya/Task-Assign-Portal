using TaskAssignAPI.DTOs;
using TaskAssignAPI.Interfaces;
using TaskAssignAPI.Models;

namespace TaskAssignAPI.Services
{
    public class LoginService : ILoginService
    {
        private readonly IGenericRepository<Users> _repository;

        public LoginService(IGenericRepository<Users> repository)
        {
            _repository = repository;
        }

        public async Task<object?> LoginAsync(LoginDto loginDto)
        {
            var users = await _repository.GetAllAsync();

            var user = users.FirstOrDefault(u =>
                u.Username == loginDto.Username &&
                u.PasswordHash == loginDto.Password &&
                u.IsActive);

            if (user == null)
                return null;

            return new
            {
                user.UserId,
                user.Username,
                user.Role
            };
        }
    }
}