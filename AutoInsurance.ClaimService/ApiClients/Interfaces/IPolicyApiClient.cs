using AutoInsurance.ClaimService.DTOs;

namespace AutoInsurance.ClaimService.ApiClients.Interfaces;

public interface IPolicyApiClient
{
    Task<PolicyDto?> GetPolicyByIdAsync(int policyId);
}