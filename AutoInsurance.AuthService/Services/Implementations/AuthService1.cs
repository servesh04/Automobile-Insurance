using AutoInsurance.AuthService.DTOs;
using AutoInsurance.AuthService.Models;
using AutoInsurance.AuthService.Repositories.Interfaces;
using AutoInsurance.AuthService.Services.Interfaces;

namespace AutoInsurance.AuthService.Services.Implementations
{
    public class AuthService1 : IAuthService
    {
        private readonly IAuthRepository _authRepository;
        private readonly IJwtTokenService _jwtTokenService;

        public AuthService1(IAuthRepository authRepository, IJwtTokenService jwtTokenService)
        {
            _authRepository = authRepository;
            _jwtTokenService = jwtTokenService;
        }

        public async Task<LoginResponseDto> RegisterAsync(RegisterRequestDto request)
        {
            var existing = await _authRepository.GetUserByUsernameAsync(request.Username);
            if (existing is not null)
                return new LoginResponseDto { Success = false, Message = "Username already taken." };

            var user = new User
            {
                UserName = request.Username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                FullName = request.FullName,
                Email = request.Email,
                IsActive = true
            };

            await _authRepository.AddUserWithRoleAsync(user, "Customer");  

            var token = _jwtTokenService.GenerateToken(user, new List<string> { "Customer" });
            return new LoginResponseDto
            {
                Success = true,
                Message = "Registration successful.",
                Token = token,
                Username = user.UserName,
                FullName = user.FullName,
                Roles = new List<string> { "Customer" }
            };
        }

        public async Task<LoginResponseDto> LoginAsync(LoginRequestDto request)
        {
            var user = await _authRepository.GetUserByUsernameAsync(request.Username);
            if(user == null)
            {
                return new LoginResponseDto { Success = false, Message = "Invalid username" };
            }

            var passwordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
            if (!passwordValid)
            {
                return new LoginResponseDto { Success = false, Message = "Invalid password" };
            }

            var roles = user.UserRoles.Select(ur => ur.Role.RoleName).ToList();
            var token = _jwtTokenService.GenerateToken(user, roles);

            return new LoginResponseDto
            {
                Success = true,
                Message = "Login successful",
                Token = token,
                Username = user.UserName,
                FullName = user.FullName,
                Roles = roles
            };
        }
    }
}
