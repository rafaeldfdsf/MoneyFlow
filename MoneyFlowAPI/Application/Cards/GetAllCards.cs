using Microsoft.EntityFrameworkCore;
using MoneyFlowAPI.Models;

namespace MoneyFlowAPI.Application.Cards
{
    public class GetAllCards
    {
        private readonly AppDbContext _context;

        public GetAllCards(AppDbContext context) => _context = context;

        // Ordena por criação mais recente para a grelha mostrar primeiro os últimos cartões.
        public async Task<List<Card>> ExecuteAsync(int userId)
        {
            return await _context.Cards
                .Where(card => card.UserId == userId)
                .AsNoTracking()
                .OrderByDescending(card => card.CreatedAt)
                .ThenByDescending(card => card.Id)
                .ToListAsync();
        }
    }
}
