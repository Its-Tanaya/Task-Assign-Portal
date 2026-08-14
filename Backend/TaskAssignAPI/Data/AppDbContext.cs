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

        // Database Tables
        public DbSet<Departments> Departments { get; set; }
        public DbSet<Employees> Employees { get; set; }
        public DbSet<Messages> Messages { get; set; }
        public DbSet<SalaryHistory> SalaryHistory { get; set; }
        public DbSet<TaskAssignments> TaskAssignments { get; set; }
        public DbSet<Tasks> Tasks { get; set; }
        public DbSet<Users> Users { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Departments
            modelBuilder.Entity<Departments>()
                .ToTable("Departments");

            modelBuilder.Entity<Departments>()
                .HasKey(d => d.DepartmentId);


            // Employees
            modelBuilder.Entity<Employees>()
                .ToTable("Employees");

            modelBuilder.Entity<Employees>()
                .HasKey(e => e.EmployeeId);


            // Users
            modelBuilder.Entity<Users>()
                .ToTable("Users");

            modelBuilder.Entity<Users>()
                .HasKey(u => u.UserId);


            // Tasks
            modelBuilder.Entity<Tasks>()
                .ToTable("Tasks");

            modelBuilder.Entity<Tasks>()
                .HasKey(t => t.TaskId);


            // TaskAssignments
            modelBuilder.Entity<TaskAssignments>()
                .ToTable("TaskAssignments");

            modelBuilder.Entity<TaskAssignments>()
                .HasKey(ta => ta.TaskAssignmentId);


            // SalaryHistory
            modelBuilder.Entity<SalaryHistory>()
                .ToTable("SalaryHistory");

            modelBuilder.Entity<SalaryHistory>()
                .HasKey(sh => sh.SalaryHistoryId);


            // Messages
            modelBuilder.Entity<Messages>()
                .ToTable("Messages");

            modelBuilder.Entity<Messages>()
                .HasKey(m => m.MessageId);
        }
    }
}