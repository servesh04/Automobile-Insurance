using AutoInsurance.PolicyService.ApiClients.Interfaces;
using AutoInsurance.PolicyService.DTOs;
using AutoInsurance.PolicyService.Models;
using AutoInsurance.PolicyService.Repositories.Interfaces;
using AutoInsurance.PolicyService.Services.Interfaces;

namespace AutoInsurance.PolicyService.Services.Implementations;

public class PolicyService1 : IPolicyService
{
    private readonly IPolicyRepository _repository;
    private readonly ICustomerApiClient _customerApiClient;
    private readonly IVehicleApiClient _vehicleApiClient;

    public PolicyService1(
        IPolicyRepository repository,
        ICustomerApiClient customerApiClient,
        IVehicleApiClient vehicleApiClient)
    {
        _repository = repository;
        _customerApiClient = customerApiClient;
        _vehicleApiClient = vehicleApiClient;
    }

    public async Task<List<PolicyResponseDto>> GetAllAsync()
    {
        var policies = await _repository.GetAllAsync();
        var result = new List<PolicyResponseDto>();

        foreach (var policy in policies)
        {
            
            var customer = await _customerApiClient.GetCustomerByIdAsync(policy.CustomerId);
            var vehicle = await _vehicleApiClient.GetVehicleByIdAsync(policy.VehicleId);
            result.Add(MapToDto(policy, customer, vehicle));
        }

        return result;
    }

    public async Task<PolicyResponseDto?> GetByIdAsync(int id)
    {
        var policy = await _repository.GetByIdAsync(id);
        if (policy is null) return null;

        var customer = await _customerApiClient.GetCustomerByIdAsync(policy.CustomerId);
        var vehicle = await _vehicleApiClient.GetVehicleByIdAsync(policy.VehicleId);
        return MapToDto(policy, customer, vehicle);
    }

    public async Task<PolicyResponseDto?> CreateAsync(PolicyCreateDto dto)
    {
        var customer = await _customerApiClient.GetCustomerByIdAsync(dto.CustomerId);
        var vehicle = await _vehicleApiClient.GetVehicleByIdAsync(dto.VehicleId);

        if (customer is null || vehicle is null)
            return null;   

        var policy = new Policy
        {
            CustomerId = dto.CustomerId,
            VehicleId = dto.VehicleId,
            PolicyNumber = GeneratePolicyNumber(),
            CoverageType = dto.CoverageType,
            PremiumAmount = dto.PremiumAmount,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            PolicyStatus = "Active",
            CreatedAt = DateTime.UtcNow
        };

        await _repository.AddAsync(policy);
        await _repository.SaveChangesAsync();

        return MapToDto(policy, customer, vehicle);
    }

    public async Task<bool> UpdateAsync(int id, PolicyUpdateDto dto)
    {
        var policy = await _repository.GetByIdAsync(id);
        if (policy is null) return false;

        policy.CoverageType = dto.CoverageType;
        policy.PremiumAmount = dto.PremiumAmount;
        policy.StartDate = dto.StartDate;
        policy.EndDate = dto.EndDate;
        policy.PolicyStatus = dto.PolicyStatus;

        _repository.Update(policy);
        await _repository.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var policy = await _repository.GetByIdAsync(id);
        if (policy is null) return false;

        _repository.Delete(policy);
        await _repository.SaveChangesAsync();
        return true;
    }

    private static string GeneratePolicyNumber()
    {
        var timestamp = DateTime.Now.ToString("yyyyMMddHHmmss");
        var randomDigits = Random.Shared.Next(0, 10000).ToString("D4");
        return $"POL-{timestamp}-{randomDigits}";
    }

    private static PolicyResponseDto MapToDto(Policy p, CustomerDto? customer, VehicleDto? vehicle) => new()
    {
        PolicyId = p.PolicyId,
        OwnerUserId = customer?.UserId ?? -1,
        PolicyNumber = p.PolicyNumber,
        CustomerId = p.CustomerId,
        CustomerName = customer?.FullName ?? "Unknown",
        VehicleId = p.VehicleId,
        VehicleDescription = vehicle is null ? "Unknown" : $"{vehicle.Year} {vehicle.Make} {vehicle.Model}",
        CoverageType = p.CoverageType,
        PremiumAmount = p.PremiumAmount,
        StartDate = p.StartDate,
        EndDate = p.EndDate,
        PolicyStatus = p.PolicyStatus,
        CreatedAt = p.CreatedAt
    };
}