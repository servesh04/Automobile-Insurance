using AutoInsurance.VehicleService.Models;
using Microsoft.EntityFrameworkCore;

namespace AutoInsurance.VehicleService.Data;

public class VehicleDbContext : DbContext
{
    public VehicleDbContext(DbContextOptions<VehicleDbContext> options) : base(options) { }

    public DbSet<Vehicle> Vehicles => Set<Vehicle>();
}