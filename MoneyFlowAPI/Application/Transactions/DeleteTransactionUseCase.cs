using Microsoft.EntityFrameworkCore;
using MoneyFlowAPI.Models;

namespace MoneyFlowAPI.Application.Transactions
{
    public class DeleteTransactionUseCase
    {
        private readonly AppDbContext _context;

        public DeleteTransactionUseCase(AppDbContext context) => _context = context;

        public async Task<bool> ExecuteAsync(List<int> ids)
        {
            if (ids == null || !ids.Any())
                return false;

            var transactionsToDelete = await _context.Transactions
                .Where(t => ids.Contains(t.Id))
                .ToListAsync();

            if (!transactionsToDelete.Any())
                return false;

            _context.Transactions.RemoveRange(transactionsToDelete);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
