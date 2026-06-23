using AutoInsurance.AuthService.DTOs;

namespace AutoInsurance.AuthService.Services.Interfaces
{
    public interface IAuthService
    {
        Task<LoginResponseDto> LoginAsync(LoginRequestDto request);
        Task<LoginResponseDto> RegisterAsync(RegisterRequestDto request);
    }
}
