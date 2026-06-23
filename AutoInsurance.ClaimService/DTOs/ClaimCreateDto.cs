using System.ComponentModel.DataAnnotations;

namespace AutoInsurance.ClaimService.DTOs;

public class ClaimCreateDto : IValidatableObject
{
    [Required(ErrorMessage = "PolicyId is required.")]
    [Range(1, int.MaxValue, ErrorMessage = "PolicyId must be a positive number.")]
    public int PolicyId { get; set; }

    [Required(ErrorMessage = "Incident date is required.")]
    public DateTime IncidentDate { get; set; }

    [Required(ErrorMessage = "Incident description is required.")]
    [StringLength(500, MinimumLength = 10, ErrorMessage = "Description must be between 10 and 500 characters.")]
    public string IncidentDescription { get; set; } = string.Empty;

    [Required(ErrorMessage = "Claim amount is required.")]
    [Range(0.01, double.MaxValue, ErrorMessage = "Claim amount must be greater than zero.")]
    public decimal ClaimAmount { get; set; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (IncidentDate > DateTime.UtcNow)
        {
            yield return new ValidationResult(
                "Incident date cannot be in the future.",
                new[] { nameof(IncidentDate) });
        }
    }
}