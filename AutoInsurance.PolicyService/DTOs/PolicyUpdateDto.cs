using System.ComponentModel.DataAnnotations;

namespace AutoInsurance.PolicyService.DTOs;

public class PolicyUpdateDto : IValidatableObject
{
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

    [Required(ErrorMessage = "Policy status is required.")]
    [RegularExpression(@"^(Active|Expired|Cancelled)$",
        ErrorMessage = "Policy status must be one of: Active, Expired, Cancelled.")]
    public string PolicyStatus { get; set; } = string.Empty;

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