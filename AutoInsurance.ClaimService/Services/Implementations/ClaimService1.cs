using AutoInsurance.ClaimService.ApiClients.Interfaces;
using AutoInsurance.ClaimService.DTOs;
using AutoInsurance.ClaimService.Models;
using AutoInsurance.ClaimService.Repositories.Interfaces;
using AutoInsurance.ClaimService.Services.Interfaces;

namespace AutoInsurance.ClaimService.Services.Implementations;

public class ClaimService1 : IClaimService
{
    private readonly IClaimRepository _repository;
    private readonly IPolicyApiClient _policyApiClient;

    public ClaimService1(IClaimRepository repository, IPolicyApiClient policyApiClient)
    {
        _repository = repository;
        _policyApiClient = policyApiClient;
    }

    public async Task<List<ClaimResponseDto>> GetAllAsync()
    {
        var claims = await _repository.GetAllAsync();
        var result = new List<ClaimResponseDto>();

        foreach (var claim in claims)
        {
            var policy = await _policyApiClient.GetPolicyByIdAsync(claim.PolicyId);
            result.Add(MapToDto(claim, policy));
        }

        return result;
    }

    public async Task<ClaimResponseDto?> GetByIdAsync(int id)
    {
        var claim = await _repository.GetByIdAsync(id);
        if (claim is null) return null;

        var policy = await _policyApiClient.GetPolicyByIdAsync(claim.PolicyId);
        return MapToDto(claim, policy);
    }

    public async Task<ClaimResponseDto?> CreateAsync(ClaimCreateDto dto)
    {
        var policy = await _policyApiClient.GetPolicyByIdAsync(dto.PolicyId);
        if (policy is null)
            return null;   
        if (policy.PolicyStatus != "Active")
            return null;   

        var claim = new Claim
        {
            PolicyId = dto.PolicyId,
            ClaimNumber = GenerateClaimNumber(),
            IncidentDate = dto.IncidentDate,
            IncidentDescription = dto.IncidentDescription,
            ClaimAmount = dto.ClaimAmount,
            ClaimStatus = "Pending",
            SubmittedAt = DateTime.UtcNow
        };

        await _repository.AddAsync(claim);
        await _repository.SaveChangesAsync();

        return MapToDto(claim, policy);
    }

    public async Task<bool> UpdateStatusAsync(int id, ClaimUpdateStatusDto dto)
    {
        var claim = await _repository.GetByIdAsync(id);
        if (claim is null) return false;

        claim.ClaimStatus = dto.ClaimStatus;
        claim.ResolvedAt = dto.ResolvedAt;

        _repository.Update(claim);
        await _repository.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var claim = await _repository.GetByIdAsync(id);
        if (claim is null) return false;

        _repository.Delete(claim);
        await _repository.SaveChangesAsync();
        return true;
    }

    private static string GenerateClaimNumber()
    {
        var timestamp = DateTime.Now.ToString("yyyyMMddHHmmss");
        var randomDigits = Random.Shared.Next(0, 10000).ToString("D4");
        return $"CLM-{timestamp}-{randomDigits}";
    }

    private static ClaimResponseDto MapToDto(Claim c, PolicyDto? policy) => new()
    {
        ClaimId = c.ClaimId,
        ClaimNumber = c.ClaimNumber,
        PolicyId = c.PolicyId,
        PolicyNumber = policy?.PolicyNumber ?? "Unknown",
        IncidentDate = c.IncidentDate,
        IncidentDescription = c.IncidentDescription,
        ClaimAmount = c.ClaimAmount,
        ClaimStatus = c.ClaimStatus,
        SubmittedAt = c.SubmittedAt,
        ResolvedAt = c.ResolvedAt,
        OwnerUserId = policy?.OwnerUserId ?? -1
    };
}