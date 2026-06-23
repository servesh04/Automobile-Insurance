namespace AutoInsurance.PolicyService.Models;

public class Policy
{
    public int PolicyId { get; set; }
    public int CustomerId { get; set; }
    public int VehicleId { get; set; }
    public string PolicyNumber { get; set; } = string.Empty;
    public string CoverageType { get; set; } = string.Empty;   // ThirdParty / Comprehensive / Collision
    public decimal PremiumAmount { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public string PolicyStatus { get; set; } = string.Empty;   // Active / Expired / Cancelled
    public DateTime CreatedAt { get; set; }
}