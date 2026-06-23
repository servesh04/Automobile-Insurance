using System.ComponentModel.DataAnnotations;
using AutoInsurance.CustomerService.Validation;

namespace AutoInsurance.CustomerService.DTOs;

public class CustomerCreateDto
{
    [Required(ErrorMessage = "Full name is required.")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Full name must be between 2 and 100 characters.")]
    [RegularExpression(@"^[a-zA-Z\s]+$", ErrorMessage = "Full name can only contain letters and spaces.")]
    public string FullName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email is required.")]
    [EmailAddress(ErrorMessage = "Invalid email address format.")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Phone number is required.")]
    [RegularExpression(@"^\d{10}$", ErrorMessage = "Phone number must be exactly 10 digits.")]
    public string Phone { get; set; } = string.Empty;

    [Required(ErrorMessage = "Date of birth is required.")]
    [MinimumAge(18, ErrorMessage = "Customer must be at least 18 years old.")]
    public DateOnly DateOfBirth { get; set; }

    [Required(ErrorMessage = "License number is required.")]
    [StringLength(20, MinimumLength = 5, ErrorMessage = "License number must be between 5 and 20 characters.")]
    public string LicenseNumber { get; set; } = string.Empty;

    [Required(ErrorMessage = "Address is required.")]
    [StringLength(200, ErrorMessage = "Address cannot exceed 200 characters.")]
    public string Address { get; set; } = string.Empty;

    [Required(ErrorMessage = "City is required.")]
    [StringLength(50)]
    public string City { get; set; } = string.Empty;

    [Required(ErrorMessage = "State is required.")]
    [StringLength(50)]
    public string State { get; set; } = string.Empty;

    [Required(ErrorMessage = "ZIP code is required.")]
    [RegularExpression(@"^\d{6}$", ErrorMessage = "ZIP code must be exactly 6 digits.")]
    public string ZipCode { get; set; } = string.Empty;
}