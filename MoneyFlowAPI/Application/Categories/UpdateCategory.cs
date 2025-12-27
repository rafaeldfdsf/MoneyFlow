using Microsoft.EntityFrameworkCore;
using MoneyFlowAPI.Models;

namespace MoneyFlowAPI.Application.Categories
{
    public class UpdateCategory
    {
        private readonly AppDbContext _context;

        public UpdateCategory(AppDbContext context) => _context = context;

        public async Task<Category?> ExecuteAsync(Category category)
        {
            if (category == null)
                return null;

            var existing = await _context.Categories.FirstOrDefaultAsync(t => t.Id == category.Id);

            if (existing == null)
                return null;

            // Atualiza os campos permitidos
            existing.Name = category.Name;

            await _context.SaveChangesAsync();

            return existing;
        }
    }
}
