namespace AutoInsurance.ClaimService.DTOs;

public class ClaimResponseDto
{
    public int ClaimId { get; set; }
    public string ClaimNumber { get; set; } = string.Empty;
    public int PolicyId { get; set; }
    public string PolicyNumber { get; set; } = string.Empty;
    public DateTime IncidentDate { get; set; }
    public string IncidentDescription { get; set; } = string.Empty;
    public decimal ClaimAmount { get; set; }
    public string ClaimStatus { get; set; } = string.Empty;
    public DateTime SubmittedAt { get; set; }
    public DateTime? ResolvedAt { get; set; }
    public int OwnerUserId { get; set; }   
}