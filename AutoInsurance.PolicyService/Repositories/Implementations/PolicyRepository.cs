using AutoInsurance.PolicyService.Data;
using AutoInsurance.PolicyService.Models;
using AutoInsurance.PolicyService.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AutoInsurance.PolicyService.Repositories.Implementations;

public class PolicyRepository : IPolicyRepository
{
    private readonly PolicyDbContext _context;

    public PolicyRepository(PolicyDbContext context) => _context = context;

    public async Task<List<Policy>> GetAllAsync() => await _context.Policies.ToListAsync();
    public async Task<Policy?> GetByIdAsync(int id) => await _context.Policies.FindAsync(id);
    public async Task AddAsync(Policy policy) => await _context.Policies.AddAsync(policy);
    public void Update(Policy policy) => _context.Policies.Update(policy);
    public void Delete(Policy policy) => _context.Policies.Remove(policy);
    public async Task SaveChangesAsync() => await _context.SaveChangesAsync();
}