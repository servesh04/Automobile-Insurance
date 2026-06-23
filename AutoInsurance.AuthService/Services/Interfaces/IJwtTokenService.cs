using AutoInsurance.AuthService.Models;

namespace AutoInsurance.AuthService.Services.Interfaces
{
    public interface IJwtTokenService
    {
        string GenerateToken(User user, List<string> roles);
    }
}
