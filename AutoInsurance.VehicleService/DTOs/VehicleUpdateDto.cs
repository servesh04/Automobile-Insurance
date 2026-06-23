namespace AutoInsurance.VehicleService.DTOs;

public class VehicleUpdateDto
{
    public string Make { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public int Year { get; set; }
    public string VehicleIdentificationNumber { get; set; } = string.Empty;
    public string RegistrationNumber { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
    public string FuelType { get; set; } = string.Empty;
}