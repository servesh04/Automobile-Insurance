using AutoInsurance.ClaimService.Models;
using Microsoft.EntityFrameworkCore;

namespace AutoInsurance.ClaimService.Data;

public class ClaimDbContext : DbContext
{
    public ClaimDbContext(DbContextOptions<ClaimDbContext> options) : base(options) { }

    public DbSet<Claim> Claims => Set<Claim>();
}