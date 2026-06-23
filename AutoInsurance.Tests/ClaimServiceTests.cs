using AutoInsurance.ClaimService.ApiClients.Interfaces;
using AutoInsurance.ClaimService.DTOs;
using AutoInsurance.ClaimService.Models;
using AutoInsurance.ClaimService.Repositories.Interfaces;
using AutoInsurance.ClaimService.Services.Implementations;
using AutoInsurance.ClaimService.Services.Interfaces;
using FluentAssertions;
using Moq;
using NUnit.Framework;
using System.Security.Claims;
using Claim = AutoInsurance.ClaimService.Models.Claim;

namespace AutoInsurance.Tests;

[TestFixture]
public class ClaimServiceTests
{
    private Mock<IClaimRepository> _repositoryMock = null!;
    private Mock<IPolicyApiClient> _policyApiClientMock = null!;
    private IClaimService _claimService = null!;

    [SetUp]
    public void SetUp()
    {
        _repositoryMock = new Mock<IClaimRepository>();
        _policyApiClientMock = new Mock<IPolicyApiClient>();
        _claimService = new ClaimService1(_repositoryMock.Object, _policyApiClientMock.Object);
    }

    private static Claim CreateSampleClaim(int id = 1) => new()
    {
        ClaimId = id,
        PolicyId = 1,
        ClaimNumber = "CLM-20260101000000-1234",
        IncidentDate = DateTime.UtcNow.AddDays(-2),
        IncidentDescription = "Front bumper damage from a minor collision.",
        ClaimAmount = 5000m,
        ClaimStatus = "Pending",
        SubmittedAt = DateTime.UtcNow
    };

    private static ClaimCreateDto CreateSampleCreateDto() => new()
    {
        PolicyId = 1,
        IncidentDate = DateTime.UtcNow.AddDays(-1),
        IncidentDescription = "Windshield cracked due to a stone hit.",
        ClaimAmount = 3000m
    };

    private static PolicyDto ActivePolicy() => new()
    {
        PolicyId = 1,
        PolicyNumber = "POL-20260101000000-1234",
        CustomerId = 1,
        PolicyStatus = "Active",
        OwnerUserId = 25
    };

    private static PolicyDto InactivePolicy() => new()
    {
        PolicyId = 1,
        PolicyNumber = "POL-20260101000000-1234",
        CustomerId = 1,
        PolicyStatus = "Expired",
        OwnerUserId = 25
    };

    [Test]
    public async Task CreateAsync_ActivePolicy_ReturnsClaim()
    {
        _policyApiClientMock.Setup(p => p.GetPolicyByIdAsync(1)).ReturnsAsync(ActivePolicy());
        _repositoryMock.Setup(r => r.AddAsync(It.IsAny<Claim>())).Returns(Task.CompletedTask);
        _repositoryMock.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);

        var result = await _claimService.CreateAsync(CreateSampleCreateDto());

        result.Should().NotBeNull();
        result!.ClaimStatus.Should().Be("Pending");
        result.PolicyNumber.Should().Be("POL-20260101000000-1234");
        result.OwnerUserId.Should().Be(25);
        _repositoryMock.Verify(r => r.AddAsync(It.IsAny<Claim>()), Times.Once);
    }

    [Test]
    public async Task CreateAsync_PolicyNotFound_ReturnsNull()
    {
        _policyApiClientMock.Setup(p => p.GetPolicyByIdAsync(It.IsAny<int>())).ReturnsAsync((PolicyDto?)null);

        var result = await _claimService.CreateAsync(CreateSampleCreateDto());

        result.Should().BeNull();
        _repositoryMock.Verify(r => r.AddAsync(It.IsAny<Claim>()), Times.Never);
    }

    [Test]
    public async Task CreateAsync_InactivePolicy_ReturnsNull()
    {
        _policyApiClientMock.Setup(p => p.GetPolicyByIdAsync(1)).ReturnsAsync(InactivePolicy());

        var result = await _claimService.CreateAsync(CreateSampleCreateDto());

        result.Should().BeNull();
        _repositoryMock.Verify(r => r.AddAsync(It.IsAny<Claim>()), Times.Never);
    }

    [Test]
    public async Task CreateAsync_GeneratesClaimNumberWithCorrectFormat()
    {
        _policyApiClientMock.Setup(p => p.GetPolicyByIdAsync(1)).ReturnsAsync(ActivePolicy());
        _repositoryMock.Setup(r => r.AddAsync(It.IsAny<Claim>())).Returns(Task.CompletedTask);
        _repositoryMock.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);

        var result = await _claimService.CreateAsync(CreateSampleCreateDto());

        result!.ClaimNumber.Should().MatchRegex(@"^CLM-\d{14}-\d{4}$");
    }

    [Test]
    public async Task GetByIdAsync_ExistingClaim_ReturnsClaimWithPolicyInfo()
    {
        var claim = CreateSampleClaim(1);
        _repositoryMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(claim);
        _policyApiClientMock.Setup(p => p.GetPolicyByIdAsync(1)).ReturnsAsync(ActivePolicy());

        var result = await _claimService.GetByIdAsync(1);

        result.Should().NotBeNull();
        result!.ClaimId.Should().Be(1);
        result.PolicyNumber.Should().Be("POL-20260101000000-1234");
        result.OwnerUserId.Should().Be(25);
    }

    [Test]
    public async Task GetByIdAsync_NonExistingClaim_ReturnsNull()
    {
        _repositoryMock.Setup(r => r.GetByIdAsync(999)).ReturnsAsync((Claim?)null);

        var result = await _claimService.GetByIdAsync(999);

        result.Should().BeNull();
        _policyApiClientMock.Verify(p => p.GetPolicyByIdAsync(It.IsAny<int>()), Times.Never);
    }

    [Test]
    public async Task GetByIdAsync_PolicyLookupFails_ReturnsFallbackOwnerUserId()
    {
        var claim = CreateSampleClaim(1);
        _repositoryMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(claim);
        _policyApiClientMock.Setup(p => p.GetPolicyByIdAsync(1)).ReturnsAsync((PolicyDto?)null);

        var result = await _claimService.GetByIdAsync(1);

        result.Should().NotBeNull();
        result!.OwnerUserId.Should().Be(-1);
        result.PolicyNumber.Should().Be("Unknown");
    }

    [Test]
    public async Task UpdateStatusAsync_ExistingClaim_ReturnsTrue()
    {
        var existing = CreateSampleClaim(1);
        _repositoryMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(existing);
        _repositoryMock.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);

        var dto = new ClaimUpdateStatusDto { ClaimStatus = "Approved", ResolvedAt = DateTime.UtcNow };

        var result = await _claimService.UpdateStatusAsync(1, dto);

        result.Should().BeTrue();
        existing.ClaimStatus.Should().Be("Approved");
        existing.ResolvedAt.Should().NotBeNull();
        _repositoryMock.Verify(r => r.Update(existing), Times.Once);
    }

    [Test]
    public async Task UpdateStatusAsync_NonExistingClaim_ReturnsFalse()
    {
        _repositoryMock.Setup(r => r.GetByIdAsync(999)).ReturnsAsync((Claim?)null);

        var result = await _claimService.UpdateStatusAsync(999, new ClaimUpdateStatusDto { ClaimStatus = "Rejected" });

        result.Should().BeFalse();
        _repositoryMock.Verify(r => r.SaveChangesAsync(), Times.Never);
    }

    [Test]
    public async Task DeleteAsync_ExistingId_ReturnsTrue()
    {
        var existing = CreateSampleClaim(1);
        _repositoryMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(existing);
        _repositoryMock.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);

        var result = await _claimService.DeleteAsync(1);

        result.Should().BeTrue();
        _repositoryMock.Verify(r => r.Delete(existing), Times.Once);
    }

    [Test]
    public async Task DeleteAsync_NonExistingId_ReturnsFalse()
    {
        _repositoryMock.Setup(r => r.GetByIdAsync(999)).ReturnsAsync((Claim?)null);

        var result = await _claimService.DeleteAsync(999);

        result.Should().BeFalse();
    }
}