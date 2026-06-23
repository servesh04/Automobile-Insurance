using AutoInsurance.AuthService.DTOs;
using AutoInsurance.AuthService.Models;
using AutoInsurance.AuthService.Repositories.Interfaces;
using AutoInsurance.AuthService.Services.Implementations;
using AutoInsurance.AuthService.Services.Interfaces;
using FluentAssertions;
using Moq;
using NUnit.Framework;

namespace AutoInsurance.Tests;

[TestFixture]
public class AuthServiceTests
{
    private Mock<IAuthRepository> _authRepositoryMock = null!;
    private Mock<IJwtTokenService> _jwtTokenServiceMock = null!;
    private IAuthService _authService = null!;

    [SetUp]
    public void SetUp()
    {
        _authRepositoryMock = new Mock<IAuthRepository>();
        _jwtTokenServiceMock = new Mock<IJwtTokenService>();
        _authService = new AuthService1(_authRepositoryMock.Object, _jwtTokenServiceMock.Object);
    }

    private static User CreateUserWithPassword(string username, string plainPassword, string roleName = "Customer")
    {
        var role = new Role { RoleId = 1, RoleName = roleName };
        var user = new User
        {
            UserId = 1,
            UserName = username,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(plainPassword),
            FullName = "Test User",
            Email = "test@example.com",
            IsActive = true
        };
        user.UserRoles = new List<UserRole>
        {
            new UserRole { UserId = user.UserId, RoleId = role.RoleId, Role = role, User = user }
        };
        return user;
    }

    [Test]
    public async Task LoginAsync_ValidCredentials_ReturnsSuccessWithToken()
    {
        var user = CreateUserWithPassword("admin", "admin123", "Admin");
        _authRepositoryMock.Setup(r => r.GetUserByUsernameAsync("admin")).ReturnsAsync(user);
        _jwtTokenServiceMock.Setup(j => j.GenerateToken(user, It.Is<List<string>>(r => r.Contains("Admin"))))
            .Returns("fake-jwt-token");

        var result = await _authService.LoginAsync(new LoginRequestDto { Username = "admin", Password = "admin123" });

        result.Success.Should().BeTrue();
        result.Token.Should().Be("fake-jwt-token");
        result.Username.Should().Be("admin");
        result.Roles.Should().Contain("Admin");
        _jwtTokenServiceMock.Verify(j => j.GenerateToken(user, It.IsAny<List<string>>()), Times.Once);
    }

    [Test]
    public async Task LoginAsync_InvalidUsername_ReturnsFailure()
    {
        
        _authRepositoryMock.Setup(r => r.GetUserByUsernameAsync("ghost")).ReturnsAsync((User?)null);

        var result = await _authService.LoginAsync(new LoginRequestDto { Username = "ghost", Password = "whatever123" });

        result.Success.Should().BeFalse();
        result.Token.Should().BeNull();
        result.Message.Should().Be("Invalid username");
        _jwtTokenServiceMock.Verify(j => j.GenerateToken(It.IsAny<User>(), It.IsAny<List<string>>()), Times.Never);
    }

    [Test]
    public async Task LoginAsync_InvalidPassword_ReturnsFailure()
    {
        var user = CreateUserWithPassword("admin", "admin123", "Admin");
        _authRepositoryMock.Setup(r => r.GetUserByUsernameAsync("admin")).ReturnsAsync(user);

        var result = await _authService.LoginAsync(new LoginRequestDto { Username = "admin", Password = "wrongpassword" });

        result.Success.Should().BeFalse();
        result.Token.Should().BeNull();
        result.Message.Should().Be("Invalid password");
        _jwtTokenServiceMock.Verify(j => j.GenerateToken(It.IsAny<User>(), It.IsAny<List<string>>()), Times.Never);
    }

    [Test]
    public async Task LoginAsync_DeactivatedUser_ReturnsFailure()
    {
        _authRepositoryMock.Setup(r => r.GetUserByUsernameAsync("disableduser")).ReturnsAsync((User?)null);

        var result = await _authService.LoginAsync(new LoginRequestDto { Username = "disableduser", Password = "whatever" });

        result.Success.Should().BeFalse();
    }

    [Test]
    public async Task LoginAsync_EmptyUsername_ReturnsFailure()
    {
        
        _authRepositoryMock.Setup(r => r.GetUserByUsernameAsync(string.Empty)).ReturnsAsync((User?)null);

        var result = await _authService.LoginAsync(new LoginRequestDto { Username = "", Password = "test123" });

        result.Success.Should().BeFalse();
    }

    [Test]
    public async Task LoginAsync_UserWithMultipleRoles_ReturnsAllRoles()
    {
        
        var user = CreateUserWithPassword("multiuser", "pass123", "Agent");
        user.UserRoles.Add(new UserRole
        {
            UserId = user.UserId,
            RoleId = 2,
            Role = new Role { RoleId = 2, RoleName = "Admin" }
        });

        _authRepositoryMock.Setup(r => r.GetUserByUsernameAsync("multiuser")).ReturnsAsync(user);
        _jwtTokenServiceMock.Setup(j => j.GenerateToken(user, It.IsAny<List<string>>())).Returns("token");

        var result = await _authService.LoginAsync(new LoginRequestDto { Username = "multiuser", Password = "pass123" });

        result.Roles.Should().BeEquivalentTo(new[] { "Agent", "Admin" });
    }

    [Test]
    public async Task RegisterAsync_NewUsername_ReturnsSuccessWithToken()
    {
        _authRepositoryMock.Setup(r => r.GetUserByUsernameAsync("newuser")).ReturnsAsync((User?)null);
        _authRepositoryMock.Setup(r => r.AddUserWithRoleAsync(It.IsAny<User>(), "Customer")).Returns(Task.CompletedTask);
        _jwtTokenServiceMock.Setup(j => j.GenerateToken(It.IsAny<User>(), It.Is<List<string>>(r => r.Contains("Customer"))))
            .Returns("new-user-token");

        var request = new RegisterRequestDto
        {
            Username = "newuser",
            Password = "pass123",
            FullName = "New User",
            Email = "new@example.com"
        };

        var result = await _authService.RegisterAsync(request);

        result.Success.Should().BeTrue();
        result.Token.Should().Be("new-user-token");
        result.Roles.Should().Contain("Customer");
        _authRepositoryMock.Verify(r => r.AddUserWithRoleAsync(It.IsAny<User>(), "Customer"), Times.Once);
    }

    [Test]
    public async Task RegisterAsync_DuplicateUsername_ReturnsFailure()
    {
        var existingUser = CreateUserWithPassword("existinguser", "pass123");
        _authRepositoryMock.Setup(r => r.GetUserByUsernameAsync("existinguser")).ReturnsAsync(existingUser);

        var request = new RegisterRequestDto
        {
            Username = "existinguser",
            Password = "newpass",
            FullName = "Duplicate",
            Email = "dup@example.com"
        };

        var result = await _authService.RegisterAsync(request);

        result.Success.Should().BeFalse();
        result.Message.Should().Be("Username already taken.");
        _authRepositoryMock.Verify(r => r.AddUserWithRoleAsync(It.IsAny<User>(), It.IsAny<string>()), Times.Never);
    }
}