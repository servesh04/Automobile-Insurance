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
    private readonly INotificationApiClient _notificationApiClient;

    public PolicyService1(
        IPolicyRepository repository,
        ICustomerApiClient customerApiClient,
        IVehicleApiClient vehicleApiClient,
        INotificationApiClient notificationApiClient)
    {
        _repository = repository;
        _customerApiClient = customerApiClient;
        _vehicleApiClient = vehicleApiClient;
        _notificationApiClient = notificationApiClient;
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
            PolicyStatus = "ProposalSubmitted",
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

    public async Task<bool> UpdateStatusAsync(int id, string status)
    {
        var policy = await _repository.GetByIdAsync(id);
        if (policy is null) return false;

        policy.PolicyStatus = status;
        _repository.Update(policy);
        await _repository.SaveChangesAsync();
        return true;
    }

    public async Task<bool> QuoteAsync(int id, decimal premiumAmount)
    {
        var policy = await _repository.GetByIdAsync(id);
        if (policy is null) return false;

        policy.PremiumAmount = premiumAmount;
        policy.PolicyStatus = "QuoteGenerated";
        _repository.Update(policy);
        await _repository.SaveChangesAsync();

        var customer = await _customerApiClient.GetCustomerByIdAsync(policy.CustomerId);
        if (customer != null && !string.IsNullOrEmpty(customer.Email))
        {
            var body = $"Dear {customer.FullName},\n\nA quote of {premiumAmount:C} has been generated for your policy (Policy Number: {policy.PolicyNumber}).\n\nPlease log in to your dashboard to complete the payment and activate your policy.";
            await _notificationApiClient.SendEmailAsync(customer.Email, $"Policy Quote Generated - {policy.PolicyNumber}", body);
        }

        return true;
    }

    public async Task<bool> PayAsync(int id)
    {
        var policy = await _repository.GetByIdAsync(id);
        if (policy is null) return false;

        policy.PolicyStatus = "Active";
        _repository.Update(policy);
        await _repository.SaveChangesAsync();

        var customer = await _customerApiClient.GetCustomerByIdAsync(policy.CustomerId);
        if (customer != null && !string.IsNullOrEmpty(customer.Email))
        {
            var body = $"Dear {customer.FullName},\n\nYour payment for policy {policy.PolicyNumber} has been received. Your policy is now Active!\n\nPlease log in to your dashboard to view and download your policy document.";
            await _notificationApiClient.SendEmailAsync(customer.Email, $"Policy Activated - {policy.PolicyNumber}", body);
        }

        return true;
    }

    public async Task<bool> UploadDocumentAsync(int id, string documentUrl)
    {
        var policy = await _repository.GetByIdAsync(id);
        if (policy is null) return false;

        policy.DocumentUrl = documentUrl;
        policy.PolicyStatus = "ProposalSubmitted"; // Re-submit for review
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
        DocumentUrl = p.DocumentUrl,
        CreatedAt = p.CreatedAt
    };
}