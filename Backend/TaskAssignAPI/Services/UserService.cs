using AutoMapper;
using TaskAssignAPI.DTOs;
using TaskAssignAPI.Interfaces;
using TaskAssignAPI.Models;

namespace TaskAssignAPI.Services
{
    public class UserService : IUserService
    {
        private readonly IGenericRepository<Users> _repository;
        private readonly IMapper _mapper;

        public UserService(
            IGenericRepository<Users> repository,
            IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<UserDto>> GetAllUsersAsync()
        {
            var users = await _repository.GetAllAsync();

            return _mapper.Map<IEnumerable<UserDto>>(users);
        }

        
    }
}