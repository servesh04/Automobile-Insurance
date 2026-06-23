using AutoInsurance.VehicleService.DTOs;
using AutoInsurance.VehicleService.Models;
using AutoInsurance.VehicleService.Repositories.Interfaces;
using AutoInsurance.VehicleService.Services.Interfaces;

namespace AutoInsurance.VehicleService.Services.Implementations;

public class VehicleService1 : IVehicleService
{
    private readonly IVehicleRepository _repository;

    public VehicleService1(IVehicleRepository repository) => _repository = repository;

    public async Task<List<VehicleResponseDto>> GetAllAsync()
    {
        var vehicles = await _repository.GetAllAsync();
        return vehicles.Select(MapToDto).ToList();
    }

    public async Task<VehicleResponseDto?> GetByIdAsync(int id)
    {
        var vehicle = await _repository.GetByIdAsync(id);
        return vehicle is null ? null : MapToDto(vehicle);
    }

    public async Task<VehicleResponseDto> CreateAsync(VehicleCreateDto dto)
    {
        var vehicle = new Vehicle
        {
            Make = dto.Make,
            Model = dto.Model,
            Year = dto.Year,
            VehicleIdentificationNumber = dto.VehicleIdentificationNumber,
            RegistrationNumber = dto.RegistrationNumber,
            Color = dto.Color,
            FuelType = dto.FuelType,
            CreatedAt = DateTime.UtcNow
        };

        await _repository.AddAsync(vehicle);
        await _repository.SaveChangesAsync();
        return MapToDto(vehicle);
    }

    public async Task<bool> UpdateAsync(int id, VehicleUpdateDto dto)
    {
        var vehicle = await _repository.GetByIdAsync(id);
        if (vehicle is null) return false;

        vehicle.Make = dto.Make;
        vehicle.Model = dto.Model;
        vehicle.Year = dto.Year;
        vehicle.VehicleIdentificationNumber = dto.VehicleIdentificationNumber;
        vehicle.RegistrationNumber = dto.RegistrationNumber;
        vehicle.Color = dto.Color;
        vehicle.FuelType = dto.FuelType;

        _repository.Update(vehicle);
        await _repository.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var vehicle = await _repository.GetByIdAsync(id);
        if (vehicle is null) return false;

        _repository.Delete(vehicle);
        await _repository.SaveChangesAsync();
        return true;
    }

    private static VehicleResponseDto MapToDto(Vehicle v) => new()
    {
        VehicleId = v.VehicleId,
        Make = v.Make,
        Model = v.Model,
        Year = v.Year,
        VehicleIdentificationNumber = v.VehicleIdentificationNumber,
        RegistrationNumber = v.RegistrationNumber,
        Color = v.Color,
        FuelType = v.FuelType,
        CreatedAt = v.CreatedAt
    };
}