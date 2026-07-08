using AutoInsurance.PolicyService.ApiClients.Interfaces;
using AutoInsurance.PolicyService.DTOs;
using AutoInsurance.PolicyService.Models;
using AutoInsurance.PolicyService.Repositories.Interfaces;
using AutoInsurance.PolicyService.Services.Implementations;
using AutoInsurance.PolicyService.Services.Interfaces;
using FluentAssertions;
using Moq;
using NUnit.Framework;

namespace AutoInsurance.Tests;

[TestFixture]
public class PolicyServiceTests
{
    private Mock<IPolicyRepository> _repositoryMock = null!;
    private Mock<ICustomerApiClient> _customerApiClientMock = null!;
    private Mock<IVehicleApiClient> _vehicleApiClientMock = null!;
    private Mock<INotificationApiClient> _notificationApiClientMock = null!;
    private IPolicyService _policyService = null!;

    [SetUp]
    public void SetUp()
    {
        _repositoryMock = new Mock<IPolicyRepository>();
        _customerApiClientMock = new Mock<ICustomerApiClient>();
        _vehicleApiClientMock = new Mock<IVehicleApiClient>();
        _notificationApiClientMock = new Mock<INotificationApiClient>();
        _policyService = new PolicyService1(
            _repositoryMock.Object,
            _customerApiClientMock.Object,
            _vehicleApiClientMock.Object,
            _notificationApiClientMock.Object);
    }

    private static Policy CreateSamplePolicy(int id = 1) => new()
    {
        PolicyId = id,
        CustomerId = 1,
        VehicleId = 1,
        PolicyNumber = "POL-20260101000000-1234",
        CoverageType = "Comprehensive",
        PremiumAmount = 18500m,
        StartDate = new DateOnly(2026, 1, 1),
        EndDate = new DateOnly(2027, 1, 1),
        PolicyStatus = "Active",
        CreatedAt = DateTime.UtcNow
    };

    private static PolicyCreateDto CreateSampleCreateDto() => new()
    {
        CustomerId = 1,
        VehicleId = 1,
        CoverageType = "Comprehensive",
        PremiumAmount = 18500m,
        StartDate = new DateOnly(2026, 1, 1),
        EndDate = new DateOnly(2027, 1, 1)
    };

    private static CustomerDto SampleCustomer() => new()
    {
        CustomerId = 1,
        UserId = 25,
        FullName = "Rahul",
        Email = "rahul@gmail.com"
    };

    private static VehicleDto SampleVehicle() => new()
    {
        VehicleId = 1,
        Make = "Toyota",
        Model = "Camry",
        Year = 2020,
        RegistrationNumber = "KA01AB1234"
    };

    [Test]
    public async Task CreateAsync_ValidCustomerAndVehicle_ReturnsPolicy()
    {
        _customerApiClientMock.Setup(c => c.GetCustomerByIdAsync(1)).ReturnsAsync(SampleCustomer());
        _vehicleApiClientMock.Setup(v => v.GetVehicleByIdAsync(1)).ReturnsAsync(SampleVehicle());
        _repositoryMock.Setup(r => r.AddAsync(It.IsAny<Policy>())).Returns(Task.CompletedTask);
        _repositoryMock.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);

        var result = await _policyService.CreateAsync(CreateSampleCreateDto());

        result.Should().NotBeNull();
        result!.CustomerName.Should().Be("Rahul");
        result.VehicleDescription.Should().Be("2020 Toyota Camry");
        result.PolicyStatus.Should().Be("ProposalSubmitted");
        result.OwnerUserId.Should().Be(25);
        _repositoryMock.Verify(r => r.AddAsync(It.IsAny<Policy>()), Times.Once);
        _repositoryMock.Verify(r => r.SaveChangesAsync(), Times.Once);
    }

    [Test]
    public async Task CreateAsync_InvalidCustomerId_ReturnsNull()
    {
        _customerApiClientMock.Setup(c => c.GetCustomerByIdAsync(It.IsAny<int>())).ReturnsAsync((CustomerDto?)null);
        _vehicleApiClientMock.Setup(v => v.GetVehicleByIdAsync(It.IsAny<int>())).ReturnsAsync(SampleVehicle());

        var result = await _policyService.CreateAsync(CreateSampleCreateDto());

        result.Should().BeNull();
        _repositoryMock.Verify(r => r.AddAsync(It.IsAny<Policy>()), Times.Never);
    }

    [Test]
    public async Task CreateAsync_InvalidVehicleId_ReturnsNull()
    {
        _customerApiClientMock.Setup(c => c.GetCustomerByIdAsync(It.IsAny<int>())).ReturnsAsync(SampleCustomer());
        _vehicleApiClientMock.Setup(v => v.GetVehicleByIdAsync(It.IsAny<int>())).ReturnsAsync((VehicleDto?)null);

        var result = await _policyService.CreateAsync(CreateSampleCreateDto());

        result.Should().BeNull();
        _repositoryMock.Verify(r => r.AddAsync(It.IsAny<Policy>()), Times.Never);
    }

    [Test]
    public async Task CreateAsync_BothCustomerAndVehicleInvalid_ReturnsNull()
    {
        _customerApiClientMock.Setup(c => c.GetCustomerByIdAsync(It.IsAny<int>())).ReturnsAsync((CustomerDto?)null);
        _vehicleApiClientMock.Setup(v => v.GetVehicleByIdAsync(It.IsAny<int>())).ReturnsAsync((VehicleDto?)null);

        var result = await _policyService.CreateAsync(CreateSampleCreateDto());

        result.Should().BeNull();
        _repositoryMock.Verify(r => r.SaveChangesAsync(), Times.Never);
    }

    [Test]
    public async Task CreateAsync_GeneratesUniquePolicyNumberWithCorrectFormat()
    {
        // Edge case: PolicyNumber must follow "POL-yyyyMMddHHmmss-####"
        _customerApiClientMock.Setup(c => c.GetCustomerByIdAsync(It.IsAny<int>())).ReturnsAsync(SampleCustomer());
        _vehicleApiClientMock.Setup(v => v.GetVehicleByIdAsync(It.IsAny<int>())).ReturnsAsync(SampleVehicle());
        _repositoryMock.Setup(r => r.AddAsync(It.IsAny<Policy>())).Returns(Task.CompletedTask);
        _repositoryMock.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);

        var result = await _policyService.CreateAsync(CreateSampleCreateDto());

        result!.PolicyNumber.Should().MatchRegex(@"^POL-\d{14}-\d{4}$");
    }

    [Test]
    public async Task GetByIdAsync_ExistingPolicy_ReturnsPolicyResponseDto()
    {
        var policy = CreateSamplePolicy(1);
        _repositoryMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(policy);
        _customerApiClientMock.Setup(c => c.GetCustomerByIdAsync(1)).ReturnsAsync(SampleCustomer());
        _vehicleApiClientMock.Setup(v => v.GetVehicleByIdAsync(1)).ReturnsAsync(SampleVehicle());

        var result = await _policyService.GetByIdAsync(1);

        result.Should().NotBeNull();
        result!.PolicyId.Should().Be(1);
        result.CustomerName.Should().Be("Rahul");
        result.VehicleDescription.Should().Be("2020 Toyota Camry");
        result.OwnerUserId.Should().Be(25);
    }

    [Test]
    public async Task GetByIdAsync_NonExistingPolicy_ReturnsNull()
    {
        _repositoryMock.Setup(r => r.GetByIdAsync(999)).ReturnsAsync((Policy?)null);

        var result = await _policyService.GetByIdAsync(999);

        result.Should().BeNull();
        _customerApiClientMock.Verify(c => c.GetCustomerByIdAsync(It.IsAny<int>()), Times.Never);
    }

    [Test]
    public async Task GetByIdAsync_CustomerLookupFails_ReturnsFallbackOwnerUserId()
    {
        var policy = CreateSamplePolicy(1);
        _repositoryMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(policy);
        _customerApiClientMock.Setup(c => c.GetCustomerByIdAsync(1)).ReturnsAsync((CustomerDto?)null);
        _vehicleApiClientMock.Setup(v => v.GetVehicleByIdAsync(1)).ReturnsAsync(SampleVehicle());

        var result = await _policyService.GetByIdAsync(1);

        result.Should().NotBeNull();
        result!.OwnerUserId.Should().Be(-1);
        result.CustomerName.Should().Be("Unknown");
    }

    [Test]
    public async Task GetByIdAsync_VehicleLookupFails_ReturnsUnknownDescription()
    {
        var policy = CreateSamplePolicy(1);
        _repositoryMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(policy);
        _customerApiClientMock.Setup(c => c.GetCustomerByIdAsync(1)).ReturnsAsync(SampleCustomer());
        _vehicleApiClientMock.Setup(v => v.GetVehicleByIdAsync(1)).ReturnsAsync((VehicleDto?)null);

        var result = await _policyService.GetByIdAsync(1);

        result.Should().NotBeNull();
        result!.VehicleDescription.Should().Be("Unknown");
    }

    [Test]
    public async Task GetAllAsync_ReturnsEnrichedListForEachPolicy()
    {
        var policies = new List<Policy> { CreateSamplePolicy(1), CreateSamplePolicy(2) };
        _repositoryMock.Setup(r => r.GetAllAsync()).ReturnsAsync(policies);
        _customerApiClientMock.Setup(c => c.GetCustomerByIdAsync(It.IsAny<int>())).ReturnsAsync(SampleCustomer());
        _vehicleApiClientMock.Setup(v => v.GetVehicleByIdAsync(It.IsAny<int>())).ReturnsAsync(SampleVehicle());

        var result = await _policyService.GetAllAsync();

        result.Should().HaveCount(2);
        result.Should().OnlyContain(p => p.CustomerName == "Rahul");
    }

    [Test]
    public async Task UpdateAsync_ExistingId_ReturnsTrueAndUpdatesFields()
    {
        var existing = CreateSamplePolicy(1);
        _repositoryMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(existing);
        _repositoryMock.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);

        var updateDto = new PolicyUpdateDto
        {
            CoverageType = "Collision",
            PremiumAmount = 20000m,
            StartDate = existing.StartDate,
            EndDate = existing.EndDate,
            PolicyStatus = "Cancelled"
        };

        var result = await _policyService.UpdateAsync(1, updateDto);

        result.Should().BeTrue();
        existing.CoverageType.Should().Be("Collision");
        existing.PremiumAmount.Should().Be(20000m);
        existing.PolicyStatus.Should().Be("Cancelled");
        _repositoryMock.Verify(r => r.Update(existing), Times.Once);
    }

    [Test]
    public async Task UpdateAsync_NonExistingId_ReturnsFalse()
    {
        _repositoryMock.Setup(r => r.GetByIdAsync(999)).ReturnsAsync((Policy?)null);

        var result = await _policyService.UpdateAsync(999, new PolicyUpdateDto());

        result.Should().BeFalse();
        _repositoryMock.Verify(r => r.SaveChangesAsync(), Times.Never);
    }

    [Test]
    public async Task DeleteAsync_ExistingId_ReturnsTrue()
    {
        var existing = CreateSamplePolicy(1);
        _repositoryMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(existing);
        _repositoryMock.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);

        var result = await _policyService.DeleteAsync(1);

        result.Should().BeTrue();
        _repositoryMock.Verify(r => r.Delete(existing), Times.Once);
    }

    [Test]
    public async Task DeleteAsync_NonExistingId_ReturnsFalse()
    {
        _repositoryMock.Setup(r => r.GetByIdAsync(999)).ReturnsAsync((Policy?)null);

        var result = await _policyService.DeleteAsync(999);

        result.Should().BeFalse();
        _repositoryMock.Verify(r => r.Delete(It.IsAny<Policy>()), Times.Never);
    }
}