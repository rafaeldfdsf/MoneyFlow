using Microsoft.EntityFrameworkCore;
using MoneyFlowAPI.Models;

namespace MoneyFlowAPI.Application.Transactions
{
    public class GetAllTransactionsUseCase
    {
        private readonly AppDbContext _context;

        public GetAllTransactionsUseCase(AppDbContext context) => _context = context;

        public async Task<List<Models.Categories>> ExecuteAsync(int userId)
        {
            // 🔹 Lógica de negócio e acesso à base de dados
            var transactions = await _context.Transactions
                .Where(t => t.UserId == userId)
                .AsNoTracking()
                .OrderByDescending(t => t.TransactionDate)
                .ToListAsync();

            return transactions;
        }
    }
}
