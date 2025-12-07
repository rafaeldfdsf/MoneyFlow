using MoneyFlowAPI.Models;

namespace MoneyFlowAPI.Application.Transactions
{
    public class CreateTransactionUseCase
    {
        private readonly AppDbContext _context;

        public CreateTransactionUseCase(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Transaction?> ExecuteAsync(Transaction transaction)
        {
            try
            {
                if (transaction == null)
                    return null;

                transaction.CreatedAt ??= DateTime.UtcNow;

                //TODO: Alterar o id pelo utilizador logado
                transaction.UserId = 1;

                _context.Transactions.Add(transaction);
                await _context.SaveChangesAsync();

                return transaction;
            }
            catch
            {
                return null;
            }
        }
    }
}
