using Microsoft.EntityFrameworkCore;
using MoneyFlowAPI.Models;

namespace MoneyFlowAPI.Application.Cards
{
    public class UpdateCard
    {
        private readonly AppDbContext _context;

        public UpdateCard(AppDbContext context) => _context = context;

        // Atualiza apenas campos editáveis e mantém a autoria original do cartão.
        public async Task<Card?> ExecuteAsync(Card card, int userId)
        {
            if (card == null)
                return null;

            var existing = await _context.Cards
                .FirstOrDefaultAsync(currentCard => currentCard.Id == card.Id && currentCard.UserId == userId);

            if (existing == null)
                return null;

            existing.Name = card.Name;
            existing.CardType = card.CardType;
            existing.Brand = card.Brand;
            existing.Last4Digits = card.Last4Digits;
            existing.CreditLimit = card.CreditLimit;
            existing.ClosingDay = card.ClosingDay;
            existing.DueDay = card.DueDay;
            existing.IsActive = card.IsActive;

            await _context.SaveChangesAsync();

            return existing;
        }
    }
}
