using AutoInsurance.VehicleService.Data;
using AutoInsurance.VehicleService.Models;
using AutoInsurance.VehicleService.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AutoInsurance.VehicleService.Repositories.Implementations;

public class VehicleRepository : IVehicleRepository
{
    private readonly VehicleDbContext _context;

    public VehicleRepository(VehicleDbContext context) => _context = context;

    public async Task<List<Vehicle>> GetAllAsync() => await _context.Vehicles.ToListAsync();
    public async Task<Vehicle?> GetByIdAsync(int id) => await _context.Vehicles.FindAsync(id);
    public async Task AddAsync(Vehicle vehicle) => await _context.Vehicles.AddAsync(vehicle);
    public void Update(Vehicle vehicle) => _context.Vehicles.Update(vehicle);
    public void Delete(Vehicle vehicle) => _context.Vehicles.Remove(vehicle);
    public async Task SaveChangesAsync() => await _context.SaveChangesAsync();
}