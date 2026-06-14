using MoneyFlowAPI.Models;

namespace MoneyFlowAPI.Application.Cards
{
    public class CreateCard
    {
        private readonly AppDbContext _context;

        public CreateCard(AppDbContext context) => _context = context;

        // Assume o utilizador autenticado como dono do novo cartão.
        public async Task<Card?> ExecuteAsync(Card card, int userId)
        {
            if (card == null)
                return null;

            card.CreatedAt ??= DateTime.UtcNow;
            card.UserId = userId;

            _context.Cards.Add(card);
            await _context.SaveChangesAsync();

            return card;
        }
    }
}
