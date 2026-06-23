using AutoInsurance.ClaimService.DTOs;

namespace AutoInsurance.ClaimService.Services.Interfaces;

public interface IClaimService
{
    Task<List<ClaimResponseDto>> GetAllAsync();
    Task<ClaimResponseDto?> GetByIdAsync(int id);
    Task<ClaimResponseDto?> CreateAsync(ClaimCreateDto dto);
    Task<bool> UpdateStatusAsync(int id, ClaimUpdateStatusDto dto);
    Task<bool> DeleteAsync(int id);
}