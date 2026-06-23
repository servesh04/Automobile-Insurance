using AutoInsurance.CustomerService.Models;
using Microsoft.EntityFrameworkCore;

namespace AutoInsurance.CustomerService.Data
{
    public class CustomerDbContext : DbContext
    {
        public CustomerDbContext(DbContextOptions<CustomerDbContext> options) : base(options) { }
        public DbSet<Customer> Customers => Set<Customer>();
    }
}
