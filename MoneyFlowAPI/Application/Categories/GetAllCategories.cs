using Microsoft.EntityFrameworkCore;
using MoneyFlowAPI.Models;

namespace MoneyFlowAPI.Application.Categories
{
    public class GetAllCategories
    {
        private readonly AppDbContext _context;

        public GetAllCategories(AppDbContext context) => _context = context;

        public async Task<List<Category>> ExecuteAsync(int userId)
        {
            // 🔹 Lógica de negócio e acesso à base de dados
            var categories = await _context.Categories
                .Where(t => t.UserId == userId)
                .AsNoTracking()
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();

            return categories;
        }
    }
}
