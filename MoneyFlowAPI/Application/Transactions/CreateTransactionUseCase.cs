using MoneyFlowAPI.Models;

namespace MoneyFlowAPI.Application.Transactions
{
    public class CreateTransactionUseCase
    {
        private readonly AppDbContext _context;

        public CreateTransactionUseCase(AppDbContext context) => _context = context;

        public async Task<Transaction?> ExecuteAsync(Transaction transaction, int userId)
        {
            if (transaction == null)
                return null;

            transaction.CreatedAt ??= DateTime.UtcNow;
            transaction.UserId = userId;

            _context.Transactions.Add(transaction);
            await _context.SaveChangesAsync();

            return transaction;
        }
    }
}
