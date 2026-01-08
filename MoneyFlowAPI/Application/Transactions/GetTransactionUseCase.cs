using Microsoft.EntityFrameworkCore;
using MoneyFlowAPI.Models;

namespace MoneyFlowAPI.Application.Transactions
{
    public class GetTransactionUseCase
    {
        private readonly AppDbContext _context;

        public GetTransactionUseCase(AppDbContext context) => _context = context;

        public async Task<Transaction?> ExecuteAsync(int id)
        {
            if (id <= 0)
                return null;

            var transaction = await _context.Transactions
                .FirstOrDefaultAsync(t => t.Id == id);

            return transaction;
        }

        public async Task<List<Transaction>?> ExecuteAsyncIds(List<int> ids)
        {
            if (ids.Count <= 0)
                return null;

            List<Transaction>? transactions = await _context.Transactions
                .Where(t => ids.Contains(t.Id))
                .ToListAsync();

            return transactions;
        }
    }
}
