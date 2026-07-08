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
        private readonly INotificationApiClient _notificationApiClient;

        public AuthService1(IAuthRepository authRepository, IJwtTokenService jwtTokenService, INotificationApiClient notificationApiClient)
        {
            _authRepository = authRepository;
            _jwtTokenService = jwtTokenService;
            _notificationApiClient = notificationApiClient;
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

        public async Task<bool> ForgotPasswordAsync(string email)
        {
            var user = await _authRepository.GetUserByEmailAsync(email);
            if (user == null)
            {
                // Always return true to prevent email enumeration attacks
                return true;
            }

            var token = Guid.NewGuid().ToString("N");
            user.PasswordResetToken = token;
            user.PasswordResetTokenExpiry = DateTime.UtcNow.AddMinutes(15);

            await _authRepository.UpdateUserAsync(user);

            var resetLink = $"http://localhost:3001/reset-password?token={token}&email={Uri.EscapeDataString(email)}";
            var body = $"<p>Hello {user.FullName},</p><p>You requested a password reset. Click the link below to reset it:</p><p><a href='{resetLink}'>Reset Password</a></p><p>If you didn't request this, you can safely ignore this email.</p>";

            await _notificationApiClient.SendEmailAsync(user.Email, "Password Reset Request", body);

            return true;
        }

        public async Task<bool> ResetPasswordAsync(string email, string token, string newPassword)
        {
            var user = await _authRepository.GetUserByEmailAsync(email);
            if (user == null)
            {
                return false;
            }

            if (user.PasswordResetToken != token || user.PasswordResetTokenExpiry < DateTime.UtcNow)
            {
                return false;
            }

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
            user.PasswordResetToken = null;
            user.PasswordResetTokenExpiry = null;

            await _authRepository.UpdateUserAsync(user);

            return true;
        }
    }
}
