using AutoInsurance.PolicyService.Models;
using Microsoft.EntityFrameworkCore;

namespace AutoInsurance.PolicyService.Data;

public class PolicyDbContext : DbContext
{
    public PolicyDbContext(DbContextOptions<PolicyDbContext> options) : base(options) { }

    public DbSet<Policy> Policies => Set<Policy>();
}