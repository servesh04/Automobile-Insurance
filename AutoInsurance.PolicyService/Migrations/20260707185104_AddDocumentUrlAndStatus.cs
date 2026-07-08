using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AutoInsurance.PolicyService.Migrations
{
    /// <inheritdoc />
    public partial class AddDocumentUrlAndStatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DocumentUrl",
                table: "Policies",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DocumentUrl",
                table: "Policies");
        }
    }
}
