using Microsoft.EntityFrameworkCore;
using MoneyFlowAPI.Models;

namespace MoneyFlowAPI.Application.Cards
{
    public class GetCard
    {
        private readonly AppDbContext _context;

        public GetCard(AppDbContext context) => _context = context;

        // Restringe o acesso ao cartão pertencente ao utilizador autenticado.
        public async Task<Card?> ExecuteAsync(int id, int userId)
        {
            if (id <= 0)
                return null;

            return await _context.Cards
                .AsNoTracking()
                .FirstOrDefaultAsync(card => card.Id == id && card.UserId == userId);
        }
    }
}
