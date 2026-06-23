namespace AutoInsurance.ClaimService.DTOs;

public class PolicyDto
{
    public int PolicyId { get; set; }
    public string PolicyNumber { get; set; } = string.Empty;
    public int CustomerId { get; set; }
    public string PolicyStatus { get; set; } = string.Empty;
    public int OwnerUserId { get; set; }   
}