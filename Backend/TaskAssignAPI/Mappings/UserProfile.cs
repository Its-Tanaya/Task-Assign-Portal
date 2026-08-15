using AutoMapper;
using TaskAssignAPI.DTOs;
using TaskAssignAPI.Models;

namespace TaskAssignAPI.Mappings
{
    public class UserProfile : Profile
    {
        public UserProfile()
        {
            CreateMap<Users, UserDto>();
            CreateMap<UserDto, Users>();

            CreateMap<Employees, EmployeeDto>();
            CreateMap<EmployeeDto, Employees>();
        }
    }
}