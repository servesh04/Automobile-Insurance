using System.Net.Http.Headers;
using System.Net.Http.Json;
using AutoInsurance.PolicyService.ApiClients.Interfaces;
using AutoInsurance.PolicyService.DTOs;

namespace AutoInsurance.PolicyService.ApiClients.Implementations;

public class VehicleApiClient : IVehicleApiClient
{
    private readonly HttpClient _httpClient;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public VehicleApiClient(HttpClient httpClient, IHttpContextAccessor httpContextAccessor)
    {
        _httpClient = httpClient;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<VehicleDto?> GetVehicleByIdAsync(int vehicleId)
    {
        AddAuthorizationHeader();

        var response = await _httpClient.GetAsync($"api/Vehicles/{vehicleId}");
        if (!response.IsSuccessStatusCode)
            return null;

        return await response.Content.ReadFromJsonAsync<VehicleDto>();
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