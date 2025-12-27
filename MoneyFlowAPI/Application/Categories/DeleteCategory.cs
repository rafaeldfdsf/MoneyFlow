using Microsoft.EntityFrameworkCore;
using MoneyFlowAPI.Models;

namespace MoneyFlowAPI.Application.Categories
{
    public class DeleteCategory
    {
        private readonly AppDbContext _context;

        public DeleteCategory(AppDbContext context) => _context = context;

        public async Task<bool> ExecuteAsync(List<int> ids)
        {
            if (ids == null || !ids.Any())
                return false;

            var ToDelete = await _context.Categories
                .Where(t => ids.Contains(t.Id))
                .ToListAsync();

            if (!ToDelete.Any())
                return false;

            _context.Categories.RemoveRange(ToDelete);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
