namespace AutoInsurance.VehicleService.Models
{
    public class Vehicle
    {
        public int VehicleId { get; set; }
        public string Make { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public int Year { get; set; }
        public string VehicleIdentificationNumber { get; set; } = string.Empty;
        public string RegistrationNumber { get; set; } = string.Empty;
        public string Color { get; set; } = string.Empty;
        public string FuelType { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
