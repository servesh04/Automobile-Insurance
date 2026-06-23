using AutoInsurance.CustomerService.DTOs;
using AutoInsurance.CustomerService.Models;
using AutoInsurance.CustomerService.Repositories.Interfaces;
using AutoInsurance.CustomerService.Services.Implementations;
using AutoInsurance.CustomerService.Services.Interfaces;
using FluentAssertions;
using Moq;
using NUnit.Framework;

namespace AutoInsurance.Tests;

[TestFixture]
public class CustomerServiceTests
{
    private Mock<ICustomerRepository> _repositoryMock = null!;
    private ICustomerService _customerService = null!;

    [SetUp]
    public void SetUp()
    {
        _repositoryMock = new Mock<ICustomerRepository>();
        _customerService = new CustomerService1(_repositoryMock.Object);
    }

    private static Customer CreateSampleCustomer(int id = 1, int userId = 10) => new()
    {
        CustomerId = id,
        UserId = userId,
        FullName = "Rahul Sharma",
        Email = "rahul@example.com",
        Phone = "9876543210",
        DateOfBirth = new DateOnly(1990, 5, 14),
        LicenseNumber = "DL-0420190012345",
        Address = "12 MG Road",
        City = "Bengaluru",
        State = "Karnataka",
        ZipCode = "560001",
        CreatedAt = DateTime.UtcNow
    };

    private static CustomerCreateDto CreateSampleCreateDto() => new()
    {
        FullName = "Priya",
        Email = "priya@gmail.com",
        Phone = "9845012345",
        DateOfBirth = new DateOnly(1988, 11, 2),
        LicenseNumber = "KL-0720180067890",
        Address = "45 Marine Drive",
        City = "Kochi",
        State = "Kerala",
        ZipCode = "682001"
    };

    [Test]
    public async Task GetAllAsync_ReturnsListOfCustomers()
    {
        var customers = new List<Customer> { CreateSampleCustomer(1), CreateSampleCustomer(2, 11) };
        _repositoryMock.Setup(r => r.GetAllAsync()).ReturnsAsync(customers);

        var result = await _customerService.GetAllAsync();

        result.Should().HaveCount(2);
        result.Select(c => c.CustomerId).Should().BeEquivalentTo(new[] { 1, 2 });
    }

    [Test]
    public async Task GetAllAsync_NoCustomers_ReturnsEmptyList()
    {
        _repositoryMock.Setup(r => r.GetAllAsync()).ReturnsAsync(new List<Customer>());

        var result = await _customerService.GetAllAsync();

        result.Should().NotBeNull();
        result.Should().BeEmpty();
    }

    [Test]
    public async Task GetByIdAsync_ExistingId_ReturnsCustomer()
    {
        var customer = CreateSampleCustomer(1, 10);
        _repositoryMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(customer);

        var result = await _customerService.GetByIdAsync(1);

        result.Should().NotBeNull();
        result!.CustomerId.Should().Be(1);
        result.UserId.Should().Be(10);
        result.FullName.Should().Be("Rahul Sharma");
    }

    [Test]
    public async Task GetByIdAsync_NonExistingId_ReturnsNull()
    {
        _repositoryMock.Setup(r => r.GetByIdAsync(999)).ReturnsAsync((Customer?)null);

        var result = await _customerService.GetByIdAsync(999);

        result.Should().BeNull();
    }

    [Test]
    public async Task CreateAsync_ValidDto_ReturnsCreatedCustomer()
    {
        var dto = CreateSampleCreateDto();
        Customer? capturedCustomer = null;

        _repositoryMock.Setup(r => r.AddAsync(It.IsAny<Customer>()))
            .Callback<Customer>(c => capturedCustomer = c)
            .Returns(Task.CompletedTask);
        _repositoryMock.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);

        var result = await _customerService.CreateAsync(dto, userId: 25);

        result.FullName.Should().Be(dto.FullName);
        result.Email.Should().Be(dto.Email);
        result.UserId.Should().Be(25);
        capturedCustomer.Should().NotBeNull();
        capturedCustomer!.UserId.Should().Be(25);
        _repositoryMock.Verify(r => r.AddAsync(It.IsAny<Customer>()), Times.Once);
        _repositoryMock.Verify(r => r.SaveChangesAsync(), Times.Once);
    }

    [Test]
    public async Task UpdateAsync_ExistingId_ReturnsTrueAndUpdatesFields()
    {
        var existing = CreateSampleCustomer(1, 10);
        _repositoryMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(existing);
        _repositoryMock.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);

        var updateDto = new CustomerUpdateDto
        {
            FullName = "Rahul Sharma Updated",
            Email = "rahul.updated@example.com",
            Phone = "9000000000",
            DateOfBirth = existing.DateOfBirth,
            LicenseNumber = existing.LicenseNumber,
            Address = "New Address",
            City = existing.City,
            State = existing.State,
            ZipCode = existing.ZipCode
        };

        var result = await _customerService.UpdateAsync(1, updateDto);

        result.Should().BeTrue();
        existing.FullName.Should().Be("Rahul Sharma Updated");
        existing.Email.Should().Be("rahul.updated@example.com");
        existing.Address.Should().Be("New Address");
        _repositoryMock.Verify(r => r.Update(existing), Times.Once);
        _repositoryMock.Verify(r => r.SaveChangesAsync(), Times.Once);
    }

    [Test]
    public async Task UpdateAsync_NonExistingId_ReturnsFalse()
    {
        _repositoryMock.Setup(r => r.GetByIdAsync(999)).ReturnsAsync((Customer?)null);

        var result = await _customerService.UpdateAsync(999, new CustomerUpdateDto());

        result.Should().BeFalse();
        _repositoryMock.Verify(r => r.SaveChangesAsync(), Times.Never);
    }

    [Test]
    public async Task DeleteAsync_ExistingId_ReturnsTrue()
    {
        var existing = CreateSampleCustomer(1);
        _repositoryMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(existing);
        _repositoryMock.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);

        var result = await _customerService.DeleteAsync(1);

        result.Should().BeTrue();
        _repositoryMock.Verify(r => r.Delete(existing), Times.Once);
        _repositoryMock.Verify(r => r.SaveChangesAsync(), Times.Once);
    }

    [Test]
    public async Task DeleteAsync_NonExistingId_ReturnsFalse()
    {
        _repositoryMock.Setup(r => r.GetByIdAsync(999)).ReturnsAsync((Customer?)null);

        var result = await _customerService.DeleteAsync(999);

        result.Should().BeFalse();
        _repositoryMock.Verify(r => r.Delete(It.IsAny<Customer>()), Times.Never);
        _repositoryMock.Verify(r => r.SaveChangesAsync(), Times.Never);
    }
}