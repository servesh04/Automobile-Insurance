using AutoInsurance.VehicleService.DTOs;
using AutoInsurance.VehicleService.Models;
using AutoInsurance.VehicleService.Repositories.Interfaces;
using AutoInsurance.VehicleService.Services.Implementations;
using AutoInsurance.VehicleService.Services.Interfaces;
using FluentAssertions;
using Moq;
using NUnit.Framework;

namespace AutoInsurance.Tests;

[TestFixture]
public class VehicleServiceTests
{
    private Mock<IVehicleRepository> _repositoryMock = null!;
    private IVehicleService _vehicleService = null!;

    [SetUp]
    public void SetUp()
    {
        _repositoryMock = new Mock<IVehicleRepository>();
        _vehicleService = new VehicleService1(_repositoryMock.Object);
    }

    private static Vehicle CreateSampleVehicle(int id = 1) => new()
    {
        VehicleId = id,
        Make = "Toyota",
        Model = "Camry",
        Year = 2020,
        VehicleIdentificationNumber = "1HGCM82633A123456",
        RegistrationNumber = "KA01AB1234",
        Color = "White",
        FuelType = "Petrol",
        CreatedAt = DateTime.UtcNow
    };

    private static VehicleCreateDto CreateSampleCreateDto() => new()
    {
        Make = "Honda",
        Model = "City",
        Year = 2019,
        VehicleIdentificationNumber = "2HGFB2F50EH123789",
        RegistrationNumber = "KL07CD5678",
        Color = "Silver",
        FuelType = "Petrol"
    };

    [Test]
    public async Task GetAllAsync_ReturnsListOfVehicles()
    {
        var vehicles = new List<Vehicle> { CreateSampleVehicle(1), CreateSampleVehicle(2) };
        _repositoryMock.Setup(r => r.GetAllAsync()).ReturnsAsync(vehicles);

        var result = await _vehicleService.GetAllAsync();

        result.Should().HaveCount(2);
        result.Select(v => v.VehicleId).Should().BeEquivalentTo(new[] { 1, 2 });
    }

    [Test]
    public async Task GetAllAsync_NoVehicles_ReturnsEmptyList()
    {
        _repositoryMock.Setup(r => r.GetAllAsync()).ReturnsAsync(new List<Vehicle>());

        var result = await _vehicleService.GetAllAsync();

        result.Should().NotBeNull();
        result.Should().BeEmpty();
    }

    [Test]
    public async Task GetByIdAsync_ExistingId_ReturnsVehicle()
    {
        var vehicle = CreateSampleVehicle(1);
        _repositoryMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(vehicle);

        var result = await _vehicleService.GetByIdAsync(1);

        result.Should().NotBeNull();
        result!.VehicleId.Should().Be(1);
        result.Make.Should().Be("Toyota");
        result.VehicleIdentificationNumber.Should().Be("1HGCM82633A123456");
    }

    [Test]
    public async Task GetByIdAsync_NonExistingId_ReturnsNull()
    {
        _repositoryMock.Setup(r => r.GetByIdAsync(999)).ReturnsAsync((Vehicle?)null);

        var result = await _vehicleService.GetByIdAsync(999);

        result.Should().BeNull();
    }

    [Test]
    public async Task CreateAsync_ValidDto_ReturnsCreatedVehicle()
    {
        var dto = CreateSampleCreateDto();
        Vehicle? captured = null;

        _repositoryMock.Setup(r => r.AddAsync(It.IsAny<Vehicle>()))
            .Callback<Vehicle>(v => captured = v)
            .Returns(Task.CompletedTask);
        _repositoryMock.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);

        var result = await _vehicleService.CreateAsync(dto);

        result.Make.Should().Be(dto.Make);
        result.Model.Should().Be(dto.Model);
        result.VehicleIdentificationNumber.Should().Be(dto.VehicleIdentificationNumber);
        captured.Should().NotBeNull();
        _repositoryMock.Verify(r => r.AddAsync(It.IsAny<Vehicle>()), Times.Once);
        _repositoryMock.Verify(r => r.SaveChangesAsync(), Times.Once);
    }

    [Test]
    public async Task UpdateAsync_ExistingId_ReturnsTrueAndUpdatesFields()
    {
        var existing = CreateSampleVehicle(1);
        _repositoryMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(existing);
        _repositoryMock.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);

        var updateDto = new VehicleUpdateDto
        {
            Make = existing.Make,
            Model = "Camry Hybrid",
            Year = 2021,
            VehicleIdentificationNumber = existing.VehicleIdentificationNumber,
            RegistrationNumber = existing.RegistrationNumber,
            Color = "Black",
            FuelType = "Hybrid"
        };

        var result = await _vehicleService.UpdateAsync(1, updateDto);

        result.Should().BeTrue();
        existing.Model.Should().Be("Camry Hybrid");
        existing.Year.Should().Be(2021);
        existing.Color.Should().Be("Black");
        existing.FuelType.Should().Be("Hybrid");
        _repositoryMock.Verify(r => r.Update(existing), Times.Once);
        _repositoryMock.Verify(r => r.SaveChangesAsync(), Times.Once);
    }

    [Test]
    public async Task UpdateAsync_NonExistingId_ReturnsFalse()
    {
        _repositoryMock.Setup(r => r.GetByIdAsync(999)).ReturnsAsync((Vehicle?)null);

        var result = await _vehicleService.UpdateAsync(999, new VehicleUpdateDto());

        result.Should().BeFalse();
        _repositoryMock.Verify(r => r.SaveChangesAsync(), Times.Never);
    }

    [Test]
    public async Task DeleteAsync_ExistingId_ReturnsTrue()
    {
        var existing = CreateSampleVehicle(1);
        _repositoryMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(existing);
        _repositoryMock.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);

        var result = await _vehicleService.DeleteAsync(1);

        result.Should().BeTrue();
        _repositoryMock.Verify(r => r.Delete(existing), Times.Once);
        _repositoryMock.Verify(r => r.SaveChangesAsync(), Times.Once);
    }

    [Test]
    public async Task DeleteAsync_NonExistingId_ReturnsFalse()
    {
        _repositoryMock.Setup(r => r.GetByIdAsync(999)).ReturnsAsync((Vehicle?)null);

        var result = await _vehicleService.DeleteAsync(999);

        result.Should().BeFalse();
        _repositoryMock.Verify(r => r.Delete(It.IsAny<Vehicle>()), Times.Never);
        _repositoryMock.Verify(r => r.SaveChangesAsync(), Times.Never);
    }
}