namespace AutoInsurance.PolicyService.DTOs;

public class PolicyResponseDto
{
    public int PolicyId { get; set; }
    public int OwnerUserId { get; set; }
    public string PolicyNumber { get; set; } = string.Empty;
    public int CustomerId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public int VehicleId { get; set; }
    public string VehicleDescription { get; set; } = string.Empty;   // e.g. "2020 Toyota Camry"
    public string CoverageType { get; set; } = string.Empty;
    public decimal PremiumAmount { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public string PolicyStatus { get; set; } = string.Empty;
    public string? DocumentUrl { get; set; }
    public DateTime CreatedAt { get; set; }
}