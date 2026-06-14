using Microsoft.EntityFrameworkCore;
using MoneyFlowAPI.Models;

namespace MoneyFlowAPI.Application.Cards
{
    public class UpdateCardsActiveState
    {
        private readonly AppDbContext _context;

        public UpdateCardsActiveState(AppDbContext context) => _context = context;

        // Permite ativar ou desativar cartões em lote sem editar um a um.
        public async Task<bool> ExecuteAsync(List<int> ids, int userId, bool isActive)
        {
            if (ids == null || !ids.Any())
                return false;

            var cards = await _context.Cards
                .Where(card => card.UserId == userId && ids.Contains(card.Id))
                .ToListAsync();

            if (!cards.Any())
                return false;

            foreach (var card in cards)
            {
                card.IsActive = isActive;
            }

            await _context.SaveChangesAsync();

            return true;
        }
    }
}
