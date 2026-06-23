using System.Net.Http.Headers;
using System.Net.Http.Json;
using AutoInsurance.ClaimService.ApiClients.Interfaces;
using AutoInsurance.ClaimService.DTOs;

namespace AutoInsurance.ClaimService.ApiClients.Implementations;

public class PolicyApiClient : IPolicyApiClient
{
    private readonly HttpClient _httpClient;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public PolicyApiClient(HttpClient httpClient, IHttpContextAccessor httpContextAccessor)
    {
        _httpClient = httpClient;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<PolicyDto?> GetPolicyByIdAsync(int policyId)
    {
        AddAuthorizationHeader();

        var response = await _httpClient.GetAsync($"api/Policies/{policyId}");
        if (!response.IsSuccessStatusCode)
            return null;

        return await response.Content.ReadFromJsonAsync<PolicyDto>();
    }

    private void AddAuthorizationHeader()
    {
        var incomingAuthHeader = _httpContextAccessor.HttpContext?.Request.Headers["Authorization"].FirstOrDefault();

        if (!string.IsNullOrWhiteSpace(incomingAuthHeader) && incomingAuthHeader.StartsWith("Bearer "))
        {
            var token = incomingAuthHeader["Bearer ".Length..].Trim();
            _httpClient.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", token);
        }
    }
}