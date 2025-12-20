using Microsoft.EntityFrameworkCore;
using MoneyFlowAPI.Models;

namespace MoneyFlowAPI.Application.Transactions
{
    public class GetAllTransactionsUseCase
    {
        private readonly AppDbContext _context;

        public GetAllTransactionsUseCase(AppDbContext context) => _context = context;

        public async Task<List<Transaction>> ExecuteAsync()
        {
            // 🔹 Lógica de negócio e acesso à base de dados
            var transactions = await _context.Transactions
                .AsNoTracking()
                .OrderByDescending(t => t.TransactionDate)
                .ToListAsync();

            return transactions;
        }
    }
}
