using AutoInsurance.PolicyService.Models;

namespace AutoInsurance.PolicyService.Repositories.Interfaces;

public interface IPolicyRepository
{
    Task<List<Policy>> GetAllAsync();
    Task<Policy?> GetByIdAsync(int id);
    Task AddAsync(Policy policy);
    void Update(Policy policy);
    void Delete(Policy policy);
    Task SaveChangesAsync();
}