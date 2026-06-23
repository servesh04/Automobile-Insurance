using AutoInsurance.VehicleService.DTOs;

namespace AutoInsurance.VehicleService.Services.Interfaces;

public interface IVehicleService
{
    Task<List<VehicleResponseDto>> GetAllAsync();
    Task<VehicleResponseDto?> GetByIdAsync(int id);
    Task<VehicleResponseDto> CreateAsync(VehicleCreateDto dto);
    Task<bool> UpdateAsync(int id, VehicleUpdateDto dto);
    Task<bool> DeleteAsync(int id);
}