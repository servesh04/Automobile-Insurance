using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AutoInsurance.VehicleService.Migrations
{
    /// <inheritdoc />
    public partial class AddVehicleCategory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "Vehicles",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Category",
                table: "Vehicles");
        }
    }
}
