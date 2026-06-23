using AutoInsurance.PolicyService.DTOs;

namespace AutoInsurance.PolicyService.Services.Interfaces;

public interface IPolicyService
{
    Task<List<PolicyResponseDto>> GetAllAsync();
    Task<PolicyResponseDto?> GetByIdAsync(int id);
    Task<PolicyResponseDto?> CreateAsync(PolicyCreateDto dto);
    Task<bool> UpdateAsync(int id, PolicyUpdateDto dto);
    Task<bool> DeleteAsync(int id);
}