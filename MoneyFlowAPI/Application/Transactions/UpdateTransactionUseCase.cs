using Microsoft.EntityFrameworkCore;
using MoneyFlowAPI.Models;

namespace MoneyFlowAPI.Application.Transactions
{
    public class UpdateTransactionUseCase
    {
        private readonly AppDbContext _context;

        public UpdateTransactionUseCase(AppDbContext context) => _context = context;

        public async Task<Models.Categories?> ExecuteAsync(Models.Categories transaction)
        {
            if (transaction == null)
                return null;

            var existing = await _context.Transactions.FirstOrDefaultAsync(t => t.Id == transaction.Id);

            if (existing == null)
                return null;

            // Atualiza os campos permitidos
            existing.Description = transaction.Description;
            existing.Amount = transaction.Amount;
            existing.TransactionDate = transaction.TransactionDate;
            existing.CategoryId = transaction.CategoryId;
            existing.IsIncome = transaction.IsIncome;

            await _context.SaveChangesAsync();

            return existing;
        }
    }
}