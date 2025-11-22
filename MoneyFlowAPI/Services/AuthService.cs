using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MoneyFlowAPI.Models;
using MoneyFlowShared.DTOs;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace MoneyFlowAPI.Services
{
    public class AuthService(AppDbContext context, IConfiguration config)
    {
        private readonly AppDbContext _context = context;
        private readonly IConfiguration _config = config;

        public async Task<string?> Register(DTO_Register dto)
        {
            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
                return "Email já registado.";

            var user = new User
            {
                Name = dto.Name,
                Email = dto.Email,
                PasswordHash = HashPassword(dto.Password)
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return null;
        }

        public async Task<DTO_AuthResponse?> Login(DTO_Login dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (user == null || !VerifyPassword(dto.Password, user.PasswordHash))
                return null;

            var token = GenerateJwtToken(user);
            return new DTO_AuthResponse()
            {
                Token = token,
                Name = user.Name,
                Email = user.Email
            };
        }

        #region Private
        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(bytes);
        }

        private bool VerifyPassword(string password, string storedHash)
        {
            return HashPassword(password) == storedHash;
        }

        private string GenerateJwtToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim("name", user.Name)
            };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        #endregion
    }
}