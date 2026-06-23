using System.ComponentModel.DataAnnotations;

namespace AutoInsurance.PolicyService.DTOs;

public class PolicyCreateDto : IValidatableObject
{
    [Required(ErrorMessage = "CustomerId is required.")]
    [Range(1, int.MaxValue, ErrorMessage = "CustomerId must be a positive number.")]
    public int CustomerId { get; set; }

    [Required(ErrorMessage = "VehicleId is required.")]
    [Range(1, int.MaxValue, ErrorMessage = "VehicleId must be a positive number.")]
    public int VehicleId { get; set; }

    [Required(ErrorMessage = "Coverage type is required.")]
    [RegularExpression(@"^(ThirdParty|Comprehensive|Collision)$",
        ErrorMessage = "Coverage type must be one of: ThirdParty, Comprehensive, Collision.")]
    public string CoverageType { get; set; } = string.Empty;

    [Required(ErrorMessage = "Premium amount is required.")]
    [Range(0.01, double.MaxValue, ErrorMessage = "Premium amount must be greater than zero.")]
    public decimal PremiumAmount { get; set; }

    [Required(ErrorMessage = "Start date is required.")]
    public DateOnly StartDate { get; set; }

    [Required(ErrorMessage = "End date is required.")]
    public DateOnly EndDate { get; set; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (EndDate <= StartDate)
        {
            yield return new ValidationResult(
                "End date must be after start date.",
                new[] { nameof(EndDate) });
        }
    }
}