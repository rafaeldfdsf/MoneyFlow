using Microsoft.EntityFrameworkCore;
using MoneyFlowAPI.Models;

namespace MoneyFlowAPI.Application.Cards
{
    public class DeleteCard
    {
        private readonly AppDbContext _context;

        public DeleteCard(AppDbContext context) => _context = context;

        // Elimina apenas cartões pertencentes ao utilizador autenticado.
        public async Task<bool> ExecuteAsync(List<int> ids, int userId)
        {
            if (ids == null || !ids.Any())
                return false;

            var toDelete = await _context.Cards
                .Where(card => card.UserId == userId && ids.Contains(card.Id))
                .ToListAsync();

            if (!toDelete.Any())
                return false;

            _context.Cards.RemoveRange(toDelete);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
