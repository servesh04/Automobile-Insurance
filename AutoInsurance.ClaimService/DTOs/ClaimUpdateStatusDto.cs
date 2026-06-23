using System.ComponentModel.DataAnnotations;

namespace AutoInsurance.ClaimService.DTOs;

public class ClaimUpdateStatusDto : IValidatableObject
{
    [Required(ErrorMessage = "Claim status is required.")]
    [RegularExpression(@"^(Pending|Approved|Rejected)$",
        ErrorMessage = "Claim status must be one of: Pending, Approved, Rejected.")]
    public string ClaimStatus { get; set; } = string.Empty;

    public DateTime? ResolvedAt { get; set; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (ClaimStatus is "Approved" or "Rejected" && ResolvedAt is null)
        {
            yield return new ValidationResult(
                "ResolvedAt is required when approving or rejecting a claim.",
                new[] { nameof(ResolvedAt) });
        }

        if (ResolvedAt is not null && ResolvedAt > DateTime.UtcNow)
        {
            yield return new ValidationResult(
                "ResolvedAt cannot be in the future.",
                new[] { nameof(ResolvedAt) });
        }
    }
}