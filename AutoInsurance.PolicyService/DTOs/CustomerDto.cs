namespace AutoInsurance.PolicyService.DTOs;

public class CustomerDto
{
    public int CustomerId { get; set; }
    public int UserId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}