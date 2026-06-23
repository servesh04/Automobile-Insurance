using AutoInsurance.VehicleService.Models;

namespace AutoInsurance.VehicleService.Repositories.Interfaces;

public interface IVehicleRepository
{
    Task<List<Vehicle>> GetAllAsync();
    Task<Vehicle?> GetByIdAsync(int id);
    Task AddAsync(Vehicle vehicle);
    void Update(Vehicle vehicle);
    void Delete(Vehicle vehicle);
    Task SaveChangesAsync();
}