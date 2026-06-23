using AutoInsurance.ClaimService.Models;

namespace AutoInsurance.ClaimService.Repositories.Interfaces;

public interface IClaimRepository
{
    Task<List<Claim>> GetAllAsync();
    Task<Claim?> GetByIdAsync(int id);
    Task AddAsync(Claim claim);
    void Update(Claim claim);
    void Delete(Claim claim);
    Task SaveChangesAsync();
}