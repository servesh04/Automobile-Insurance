using AutoInsurance.PolicyService.DTOs;

namespace AutoInsurance.PolicyService.ApiClients.Interfaces;

public interface ICustomerApiClient
{
    Task<CustomerDto?> GetCustomerByIdAsync(int customerId);
}