namespace AutoInsurance.ClaimService.Models;

public class Claim
{
    public int ClaimId { get; set; }
    public int PolicyId { get; set; }
    public string ClaimNumber { get; set; } = string.Empty;
    public DateTime IncidentDate { get; set; }
    public string IncidentDescription { get; set; } = string.Empty;
    public decimal ClaimAmount { get; set; }
    public string ClaimStatus { get; set; } = string.Empty;   // Pending / Approved / Rejected
    public DateTime SubmittedAt { get; set; }
    public DateTime? ResolvedAt { get; set; }
}