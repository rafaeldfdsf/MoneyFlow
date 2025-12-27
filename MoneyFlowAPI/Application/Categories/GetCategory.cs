using Microsoft.EntityFrameworkCore;
using MoneyFlowAPI.Models;

namespace MoneyFlowAPI.Application.Categories
{
    public class GetCategory
    {
        private readonly AppDbContext _context;

        public GetCategory(AppDbContext context) => _context = context;

        public async Task<Category?> ExecuteAsync(int id)
        {
            if (id <= 0)
                return null;

            var transaction = await _context.Categories
                .FirstOrDefaultAsync(t => t.Id == id);

            return transaction;
        }
    }
}
