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
        public async Task UpdateUserBalanceAsync(int userId, Transaction newTransaction, Transaction? oldTransaction = null, bool isDelete = false)
        {
            decimal delta;

            if (oldTransaction != null)
            {
                // UPDATE: aplica apenas a diferença
                delta = GetSignedImpact(newTransaction) - GetSignedImpact(oldTransaction);
            }
            else
            {
                // CREATE ou DELETE
                delta = GetSignedImpact(newTransaction);
                if (isDelete)
                    delta *= -1; // DELETE desfaz
            }

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

        private static decimal GetSignedImpact(Transaction t)
        {
            // Receita => +Amount | Despesa => -Amount
            return t.IsIncome ? t.Amount : -t.Amount;
        }
        #endregion
    }
}