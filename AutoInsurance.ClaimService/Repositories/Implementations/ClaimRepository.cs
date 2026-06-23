using AutoInsurance.ClaimService.Data;
using AutoInsurance.ClaimService.Models;
using AutoInsurance.ClaimService.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AutoInsurance.ClaimService.Repositories.Implementations;

public class ClaimRepository : IClaimRepository
{
    private readonly ClaimDbContext _context;

    public ClaimRepository(ClaimDbContext context) => _context = context;

    public async Task<List<Claim>> GetAllAsync() => await _context.Claims.ToListAsync();
    public async Task<Claim?> GetByIdAsync(int id) => await _context.Claims.FindAsync(id);
    public async Task AddAsync(Claim claim) => await _context.Claims.AddAsync(claim);
    public void Update(Claim claim) => _context.Claims.Update(claim);
    public void Delete(Claim claim) => _context.Claims.Remove(claim);
    public async Task SaveChangesAsync() => await _context.SaveChangesAsync();
}