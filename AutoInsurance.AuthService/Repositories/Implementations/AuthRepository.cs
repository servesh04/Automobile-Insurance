using AutoInsurance.AuthService.Models;
using AutoInsurance.AuthService.Data;
using AutoInsurance.AuthService.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AutoInsurance.AuthService.Repositories.Implementations
{
    public class AuthRepository : IAuthRepository
    {
        private readonly AuthDbContext _context;

        public AuthRepository(AuthDbContext context)
        {
            _context = context;
        }

        public async Task AddUserWithRoleAsync(User user, string roleName)
        {
            var role = await _context.Roles.FirstAsync(r => r.RoleName == roleName);
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            _context.UserRoles.Add(new UserRole { UserId = user.UserId, RoleId = role.RoleId });
            await _context.SaveChangesAsync();
        }

        public async Task<User?> GetUserByUsernameAsync(string username)
        {
            return await _context.Users
                .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
                .FirstOrDefaultAsync(u => u.UserName == username && u.IsActive);
        }
    }
}
