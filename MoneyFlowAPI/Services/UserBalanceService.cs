using Microsoft.EntityFrameworkCore;
using MoneyFlowAPI.Models;
using MoneyFlowAPI.Services.Interfaces;

namespace MoneyFlowAPI.Services
{
    public class UserBalanceService : IUserBalanceService
    {
        private readonly AppDbContext _context;

        public UserBalanceService(AppDbContext context) => _context = context;

        #region PUT
        public async Task UpdateUserBalanceAsync(int userId, Transaction created)
        {
            decimal delta = created.IsIncome
                ? created.Amount
                : -created.Amount;

            var balance = await _context.UserBalances
                .SingleOrDefaultAsync(b => b.UserId == userId);

            if (balance == null)
            {
                balance = new UserBalance
                {
                    UserId = userId,
                    CurrentBalance = 0m,
                    UpdatedAt = DateTime.UtcNow
                };
                _context.UserBalances.Add(balance);
            }

            balance.CurrentBalance += delta;
            balance.UpdatedAt = DateTime.UtcNow;
        }
        #endregion
    }
}