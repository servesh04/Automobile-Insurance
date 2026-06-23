using AutoInsurance.PolicyService.DTOs;

namespace AutoInsurance.PolicyService.ApiClients.Interfaces;

public interface IVehicleApiClient
{
    Task<VehicleDto?> GetVehicleByIdAsync(int vehicleId);
}