using System.ComponentModel.DataAnnotations;

namespace AutoInsurance.VehicleService.DTOs;

public class VehicleCreateDto
{
    [Required(ErrorMessage = "Category is required.")]
    [RegularExpression(@"^(Car|Truck|Motorcycle|Camper Van)$",
        ErrorMessage = "Category must be one of: Car, Truck, Motorcycle, Camper Van.")]
    public string Category { get; set; } = string.Empty;

    [Required(ErrorMessage = "Make is required.")]
    [StringLength(50, MinimumLength = 2, ErrorMessage = "Make must be between 2 and 50 characters.")]
    public string Make { get; set; } = string.Empty;

    [Required(ErrorMessage = "Model is required.")]
    [StringLength(50, MinimumLength = 1, ErrorMessage = "Model must be between 1 and 50 characters.")]
    public string Model { get; set; } = string.Empty;

    [Required(ErrorMessage = "Year is required.")]
    [Range(1980, 2027, ErrorMessage = "Year must be between 1980 and 2027.")]
    public int Year { get; set; }

    [Required(ErrorMessage = "Vehicle Identification Number is required.")]
    [StringLength(17, MinimumLength = 17, ErrorMessage = "VIN must be exactly 17 characters.")]
    [RegularExpression(@"^[A-HJ-NPR-Z0-9]{17}$",
        ErrorMessage = "VIN must be 17 alphanumeric characters and cannot contain I, O, or Q.")]
    public string VehicleIdentificationNumber { get; set; } = string.Empty;

    [Required(ErrorMessage = "Registration number is required.")]
    [StringLength(20, MinimumLength = 4, ErrorMessage = "Registration number must be between 4 and 20 characters.")]
    public string RegistrationNumber { get; set; } = string.Empty;

    [Required(ErrorMessage = "Color is required.")]
    [RegularExpression(@"^[a-zA-Z\s]+$", ErrorMessage = "Color can only contain letters and spaces.")]
    [StringLength(30)]
    public string Color { get; set; } = string.Empty;

    [Required(ErrorMessage = "Fuel type is required.")]
    [RegularExpression(@"^(Petrol|Diesel|Electric|Hybrid|CNG)$",
        ErrorMessage = "Fuel type must be one of: Petrol, Diesel, Electric, Hybrid, CNG.")]
    public string FuelType { get; set; } = string.Empty;
}