using AutoInsurance.AuthService.Models;

namespace AutoInsurance.AuthService.Repositories.Interfaces
{
    public interface IAuthRepository
    {
        Task<User?> GetUserByUsernameAsync(string username);
        Task<User?> GetUserByEmailAsync(string email);
        Task AddUserWithRoleAsync(User user, string roleName);
        Task UpdateUserAsync(User user);
    }
}
