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

            CreateMap<Tasks, TaskDto>();
            CreateMap<TaskDto, Tasks>();

            CreateMap<TaskAssignments, TaskAssignmentDto>();
            CreateMap<TaskAssignmentDto, TaskAssignments>();

            CreateMap<SalaryHistory, SalaryHistoryDto>();
            CreateMap<SalaryHistoryDto, SalaryHistory>();

            CreateMap<Messages, MessageDto>();
            CreateMap<MessageDto, Messages>();
        }
    }
}