using Microsoft.EntityFrameworkCore;
using TaskAssignAPI.Models;

namespace TaskAssignAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Users> Users { get; set; }
        public DbSet<Employees> Employees { get; set; }
        public DbSet<Departments> Departments { get; set; }
        public DbSet<Tasks> Tasks { get; set; }
        public DbSet<TaskAssignments> TaskAssignments { get; set; }
        public DbSet<SalaryHistory> SalaryHistory { get; set; }
        public DbSet<Messages> Messages { get; set; }
    }
}